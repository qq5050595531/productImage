'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from '../components/upload/ImageUpload';
import { GenerationProgress, GeneratedGallery, PromptInput } from '../components/generation';
import { ApiKeyInput } from '../components/ui/ApiKeyInput';
import { useImageStore } from '../lib/store/useImageStore';
import { useGenerationStore } from '../lib/store/useGenerationStore';
import { useImageGeneration } from '../lib/hooks/useImageGeneration';
import { useDownload } from '../lib/hooks/useDownload';
import { useApiKey } from '../lib/hooks/useApiKey';

export default function Home() {
  const [customPrompt, setCustomPrompt] = useState('');
  const { isConfigured } = useApiKey();

  const {
    productImages,
    modelImages,
    referenceImages,
    addProductImage,
    removeProductImage,
    addModelImage,
    removeModelImage,
    addReferenceImage,
    removeReferenceImage,
    clearAllImages,
  } = useImageStore();

  const { generatedImages, clearGeneratedImages, error: generationError } = useGenerationStore();

  const { generateImages, isGenerating, currentProgress, progressStage } =
    useImageGeneration();

  const { downloadSingleImage, downloadAllImages } = useDownload();

  const hasImages = productImages.length > 0;
  const canGenerate = hasImages && isConfigured;

  const handleGenerate = () => {
    if (!isConfigured) {
      alert('请先配置 Gemini API Key');
      return;
    }
    generateImages({ count: 4, prompt: customPrompt || undefined });
  };

  const handleDownload = (image: typeof generatedImages[0], index: number) => {
    downloadSingleImage(image, index);
  };

  const handleDownloadAll = () => {
    downloadAllImages(generatedImages);
  };

  const handleRegenerate = () => {
    clearGeneratedImages();
    generateImages({ count: 4, prompt: customPrompt || undefined });
  };

  const handleClear = () => {
    clearGeneratedImages();
    clearAllImages();
  };

  const handleDismissError = () => {
    useGenerationStore.getState().setError(null);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            产品图生成器
          </h1>
          <p className="text-gray-400 text-lg">
            使用 AI 技术生成创意产品图，支持产品图、模特图和参考图
          </p>
        </motion.div>

        {/* Error Display */}
        {generationError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-red-500/10 border-2 border-red-500 rounded-lg p-6 relative"
          >
            <button
              onClick={handleDismissError}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold text-lg mb-2">生成失败</h3>
                <p className="text-red-300">{generationError}</p>
                <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
                  <p className="text-red-200 text-sm mb-2">可能的解决方案：</p>
                  <ul className="text-red-300 text-sm space-y-1 list-disc list-inside">
                    <li>检查 API Key 是否正确配置</li>
                    <li>确认网络连接正常</li>
                    <li>检查 API Key 额度是否充足</li>
                    <li>尝试刷新页面后重新生成</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Key Input */}
        <ApiKeyInput />

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <ImageUpload
            images={productImages}
            onAdd={addProductImage}
            onRemove={removeProductImage}
            title="产品图"
            description="上传您要展示的产品图片（必填）"
            maxCount={5}
          />
          <ImageUpload
            images={modelImages}
            onAdd={addModelImage}
            onRemove={removeModelImage}
            title="模特图"
            description="上传模特或场景图片（可选）"
            maxCount={3}
          />
          <ImageUpload
            images={referenceImages}
            onAdd={addReferenceImage}
            onRemove={removeReferenceImage}
            title="参考图"
            description="上传风格参考图片（可选）"
            maxCount={3}
          />
        </motion.div>

        {/* Prompt Input */}
        <PromptInput
          value={customPrompt}
          onChange={setCustomPrompt}
          onGenerate={handleGenerate}
          disabled={!canGenerate || isGenerating}
          isLoading={isGenerating}
        />

        {/* Progress */}
        <GenerationProgress progress={currentProgress} stage={progressStage} />

        {/* Generated Images */}
        <GeneratedGallery
          images={generatedImages}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          onRegenerate={handleRegenerate}
          onClear={handleClear}
          isRegenerating={isGenerating}
        />
      </div>
    </main>
  );
}
