'use client';

import { useCallback } from 'react';
import { useImageStore } from '../store/useImageStore';
import { useGenerationStore } from '../store/useGenerationStore';

export const useImageGeneration = () => {
  const { productImages, modelImages, referenceImages } = useImageStore();
  const { setGenerating, setProgress, setGeneratedImages, setError } =
    useGenerationStore();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateImages = useCallback(
    async (options?: { prompt?: string; count?: number }) => {
      try {
        // 开始生成
        setGenerating(true);
        setProgress(10, '准备图片数据...');

        // 检查是否有产品图
        if (productImages.length === 0) {
          throw new Error('请至少上传一张产品图片');
        }

        // 转换图片为Base64
        setProgress(20, '处理图片...');
        const productBase64 = await Promise.all(
          productImages.map((img) => convertToBase64(img.file))
        );

        const modelBase64 =
          modelImages.length > 0
            ? await Promise.all(modelImages.map((img) => convertToBase64(img.file)))
            : [];

        const referenceBase64 =
          referenceImages.length > 0
            ? await Promise.all(
                referenceImages.map((img) => convertToBase64(img.file))
              )
            : [];

        // 调用API
        setProgress(40, 'AI生成中...');
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productImages: productBase64,
            modelImages: modelBase64,
            referenceImages: referenceBase64,
            prompt: options?.prompt,
            count: options?.count || 4,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '生成失败');
        }

        setProgress(80, '处理结果...');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || '生成失败');
        }

        // 保存结果
        setProgress(100, '完成！');
        setGeneratedImages(data.images);

        setTimeout(() => {
          setGenerating(false);
          setProgress(0, '');
        }, 500);

        return data.images;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        setError(errorMessage);
        setGenerating(false);
        throw error;
      }
    },
    [
      productImages,
      modelImages,
      referenceImages,
      setGenerating,
      setProgress,
      setGeneratedImages,
      setError,
    ]
  );

  return {
    generateImages,
    isGenerating: useGenerationStore((state) => state.isGenerating),
    generatedImages: useGenerationStore((state) => state.generatedImages),
    error: useGenerationStore((state) => state.error),
    currentProgress: useGenerationStore((state) => state.currentProgress),
    progressStage: useGenerationStore((state) => state.progressStage),
  };
};
