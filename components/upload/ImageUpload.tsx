'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { ImagePreview } from './ImagePreview';
import { cn } from '../../lib/utils';
import type { UploadedImage } from '../../lib/types';

interface ImageUploadProps {
  images: UploadedImage[];
  onAdd: (image: UploadedImage) => void;
  onRemove: (id: string) => void;
  title: string;
  description: string;
  maxCount?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onAdd,
  onRemove,
  title,
  description,
  maxCount = 10,
  className,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxCount) {
        alert(`最多只能上传 ${maxCount} 张图片`);
        return;
      }

      acceptedFiles.forEach((file) => {
        const preview = URL.createObjectURL(file);
        const newImage: UploadedImage = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        onAdd(newImage);
      });
    },
    [images.length, maxCount, onAdd]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxCount - images.length,
    disabled: images.length >= maxCount,
  });

  return (
    <Card className={cn('flex-1', className)}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        <p className="text-gray-500 text-xs mt-1">
          {images.length} / {maxCount} 张图片
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {images.map((image) => (
            <ImagePreview key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      )}

      {images.length < maxCount && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/5'
          )}
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              {isDragActive ? (
                <>
                  <ImageIcon className="w-12 h-12 text-purple-500" />
                  <p className="text-white font-medium">松开以上传图片</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-500" />
                  <div>
                    <p className="text-white font-medium">
                      点击或拖拽图片到此处
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      支持 JPEG、PNG、WebP 格式，最大 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};
