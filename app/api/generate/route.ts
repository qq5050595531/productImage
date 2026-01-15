import { NextRequest, NextResponse } from 'next/server';
import { getImageModel, buildGenerationPrompt, convertBase64ToGeminiFormat } from '@/lib/gemini';

// Vercel Serverless Functions 最大执行时间（秒）
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productImages,
      modelImages = [],
      referenceImages = [],
      prompt: customPrompt,
      count = 4,
    } = body;

    console.log('[Generate API] Request received:', {
      productImagesCount: productImages?.length,
      modelImagesCount: modelImages?.length,
      referenceImagesCount: referenceImages?.length,
      hasPrompt: !!customPrompt,
      count,
    });

    // 验证输入
    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { success: false, error: '至少需要一张产品图片' },
        { status: 400 }
      );
    }

    // 限制生成数量
    if (count > 4) {
      return NextResponse.json(
        { success: false, error: '一次最多生成 4 张图片' },
        { status: 400 }
      );
    }

    // 检查请求体大小（Vercel 限制 4.5MB）
    const bodySize = JSON.stringify(body).length;
    if (bodySize > 4 * 1024 * 1024) { // 4MB
      return NextResponse.json(
        { success: false, error: '请求数据过大，请减少图片数量或降低图片质量' },
        { status: 413 }
      );
    }

    console.log('[Generate API] Input validation passed');

    // 获取模型 - 捕获 API Key 相关错误
    let model;
    try {
      model = getImageModel();
      console.log('[Generate API] Model loaded successfully');
    } catch (error) {
      console.error('[Generate API] Failed to load model:', error);
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : '请先在界面上配置 Gemini API Key'
        },
        { status: 401 }
      );
    }

    // 构建 prompt
    const fullPrompt = buildGenerationPrompt(
      true,
      modelImages.length > 0,
      referenceImages.length > 0,
      customPrompt
    );
    console.log('[Generate API] Prompt built:', fullPrompt.substring(0, 100) + '...');

    // 准备图片数据
    const allImages = [...productImages, ...modelImages, ...referenceImages];
    const imageDataParts = allImages.map((base64: string) =>
      convertBase64ToGeminiFormat(base64)
    );
    console.log('[Generate API] Image data parts prepared:', imageDataParts.length);

    // 并发生成多张图片
    const generationPromises = Array.from({ length: count }, async (_, index) => {
      try {
        console.log(`[Generate API] Starting generation ${index + 1}/${count}`);
        const result = await model.generateContent([
          fullPrompt,
          ...imageDataParts,
        ]);

        const response = await result.response;
        const generatedImage = response.candidates?.[0]?.content?.parts?.[0];

        if (!generatedImage?.inlineData?.data) {
          console.error(`[Generate API] Generation ${index + 1} failed: No image data in response`);
          return null;
        }

        console.log(`[Generate API] Generation ${index + 1} succeeded`);

        return {
          id: `generated-${Date.now()}-${index}`,
          base64: `data:image/png;base64,${generatedImage.inlineData.data}`,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error(`[Generate API] Generation ${index + 1} failed:`, error);

        // 返回更详细的错误信息
        const errorMessage = error instanceof Error
          ? error.message
          : '图片生成失败';

        return {
          error: errorMessage,
          index,
        };
      }
    });

    // 等待所有生成完成
    console.log('[Generate API] Waiting for all generations to complete...');
    const results = await Promise.all(generationPromises);

    // 分离成功和失败的结果
    const successfulResults = results.filter((r): r is Exclude<typeof r, { error: any }> =>
      r !== null && !('error' in r)
    );
    const failedResults = results.filter((r): r is { error: string; index: number } =>
      r !== null && 'error' in r
    );

    console.log('[Generate API] Results:', {
      total: results.length,
      successful: successfulResults.length,
      failed: failedResults.length,
    });

    // 如果全部失败，返回详细的错误信息
    if (successfulResults.length === 0) {
      const firstError = failedResults[0];
      const errorMessage = firstError?.error || '所有生成任务都失败了';

      console.error('[Generate API] All generations failed:', errorMessage);

      return NextResponse.json(
        {
          success: false,
          error: `${errorMessage}${failedResults.length > 1 ? ' (所有图片生成均失败)' : ''}`
        },
        { status: 500 }
      );
    }

    // 如果部分失败，在日志中记录
    if (failedResults.length > 0) {
      console.warn('[Generate API] Some generations failed:', failedResults);
    }

    console.log('[Generate API] Returning', successfulResults.length, 'successful results');

    return NextResponse.json({
      success: true,
      images: successfulResults,
    });
  } catch (error) {
    console.error('[Generate API] Unhandled error:', error);

    // 提供更详细的错误信息
    let errorMessage = '生成失败';

    if (error instanceof Error) {
      errorMessage = error.message;

      // 添加常见错误的友好提示
      if (errorMessage.includes('API_KEY')) {
        errorMessage = 'API Key 无效或未配置，请检查 API Key 是否正确';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API 配额已用完，请检查 Gemini API 使用额度';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = '请求超时，请稍后重试';
      } else if (errorMessage.includes('network')) {
        errorMessage = '网络连接失败，请检查网络设置';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
