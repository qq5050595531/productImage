'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UploadedImage } from '../../lib/types';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-colors',
        className
      )}
    >
      <img
        src={image.preview}
        alt={image.name}
        className="w-full h-full object-cover"
      />
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        aria-label="删除图片"
      >
        <X size={16} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs truncate">{image.name}</p>
        <p className="text-gray-300 text-xs">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </motion.div>
  );
};
