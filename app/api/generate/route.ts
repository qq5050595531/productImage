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

    // 获取模型
    const model = getImageModel();

    // 构建 prompt
    const fullPrompt = buildGenerationPrompt(
      true,
      modelImages.length > 0,
      referenceImages.length > 0,
      customPrompt
    );

    // 准备图片数据
    const allImages = [...productImages, ...modelImages, ...referenceImages];
    const imageDataParts = allImages.map((base64: string) =>
      convertBase64ToGeminiFormat(base64)
    );

    // 并发生成多张图片
    const generationPromises = Array.from({ length: count }, async (_, index) => {
      try {
        const result = await model.generateContent([
          fullPrompt,
          ...imageDataParts,
        ]);

        const response = await result.response;
        const generatedImage = response.candidates?.[0]?.content?.parts?.[0];

        return {
          id: `generated-${Date.now()}-${index}`,
          base64: generatedImage?.inlineData?.data
            ? `data:image/png;base64,${generatedImage.inlineData.data}`
            : null,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error(`Generation ${index} failed:`, error);
        return null;
      }
    });

    // 等待所有生成完成
    const results = await Promise.all(generationPromises);
    const successfulResults = results.filter((r) => r !== null);

    if (successfulResults.length === 0) {
      return NextResponse.json(
        { success: false, error: '所有生成任务都失败了' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: successfulResults,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '生成失败',
      },
      { status: 500 }
    );
  }
}
