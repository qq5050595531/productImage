'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { GeneratedImage } from '../../lib/types';

interface GeneratedGalleryProps {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage, index: number) => void;
  onDownloadAll: () => void;
  onRegenerate: () => void;
  onClear: () => void;
  isRegenerating?: boolean;
}

export const GeneratedGallery: React.FC<GeneratedGalleryProps> = ({
  images,
  onDownload,
  onDownloadAll,
  onRegenerate,
  onClear,
  isRegenerating = false,
}) => {
  if (images.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">生成结果</h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDownloadAll}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载全部
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              isLoading={isRegenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              重新生成
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              清除
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <img
                  src={image.base64}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onDownload(image, index)}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载图片
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
