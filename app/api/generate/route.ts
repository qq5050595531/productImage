import { NextRequest, NextResponse } from 'next/server';
import { buildGenerationPrompt, convertBase64ToGeminiFormat, getApiKey } from '@/lib/gemini';

// Vercel Serverless Functions 最大执行时间（秒）
export const maxDuration = 60;

// 使用原生 fetch 调用 Gemini REST API
async function callGeminiAPI(
  apiKey: string,
  prompt: string,
  images: any[],
  baseUrl?: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    // 构建请求体
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            ...images,
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    };

    // 构建 URL
    const defaultUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
    let url = defaultUrl;

    if (baseUrl) {
      // 使用自定义 base_url
      const path = '/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
      url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) + path : baseUrl + path;
    }

    // 添加 API Key
    const urlWithKey = `${url}?key=${apiKey}`;

    console.log('[Gemini API] Calling:', urlWithKey.replace(apiKey, '***'));

    const response = await fetch(urlWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Gemini API] Error:', response.status, errorText);
      return {
        success: false,
        error: `API 调用失败 (${response.status}): ${errorText}`,
      };
    }

    const data = await response.json();

    // 提取生成的图片（Base64）
    const generatedImage = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!generatedImage) {
      return {
        success: false,
        error: 'API 返回数据格式错误',
      };
    }

    return {
      success: true,
      data: generatedImage,
    };
  } catch (error) {
    console.error('[Gemini API] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productImages,
      modelImages = [],
      referenceImages = [],
      prompt: customPrompt,
      count = 4,
      baseUrl,
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

    // 获取 API Key
    let apiKey: string;
    try {
      apiKey = getApiKey();
      console.log('[Generate API] API Key loaded successfully');
    } catch (error) {
      console.error('[Generate API] Failed to get API Key:', error);
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

        const result = await callGeminiAPI(apiKey, fullPrompt, imageDataParts, baseUrl);

        if (!result.success || !result.data) {
          console.error(`[Generate API] Generation ${index + 1} failed:`, result.error);
          return {
            error: result.error || '图片生成失败',
            index,
          };
        }

        console.log(`[Generate API] Generation ${index + 1} succeeded`);

        return {
          id: `generated-${Date.now()}-${index}`,
          base64: `data:image/png;base64,${result.data}`,
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
