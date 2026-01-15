'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from '../components/upload/ImageUpload';
import { GenerationProgress, GeneratedGallery, PromptInput } from '../components/generation';
import { useImageStore } from '../lib/store/useImageStore';
import { useGenerationStore } from '../lib/store/useGenerationStore';
import { useImageGeneration } from '../lib/hooks/useImageGeneration';
import { useDownload } from '../lib/hooks/useDownload';

export default function Home() {
  const [customPrompt, setCustomPrompt] = useState('');

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

  const { generatedImages, clearGeneratedImages } = useGenerationStore();

  const { generateImages, isGenerating, currentProgress, progressStage } =
    useImageGeneration();

  const { downloadSingleImage, downloadAllImages } = useDownload();

  const hasImages = productImages.length > 0;

  const handleGenerate = () => {
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
          disabled={!hasImages || isGenerating}
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

        {/* Error Display */}
        {useGenerationStore.getState().error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center"
          >
            <p className="text-red-400">{useGenerationStore.getState().error}</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
