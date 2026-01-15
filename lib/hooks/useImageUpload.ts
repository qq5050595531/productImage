import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { UploadedImage } from '../types';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '../utils/constants';

interface UseImageUploadOptions {
  maxSize?: number;
  acceptedTypes?: string[];
  maxCount?: number;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxSize = MAX_FILE_SIZE,
    acceptedTypes = ACCEPTED_IMAGE_TYPES,
    maxCount = 10,
  } = options;

  const validateImage = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // 检查文件类型
      if (!acceptedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `不支持的文件类型。请上传 ${acceptedTypes.join(', ')} 格式的图片`,
        };
      }

      // 检查文件大小
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `文件大小不能超过 ${maxSize / 1024 / 1024}MB`,
        };
      }

      return { valid: true };
    },
    [acceptedTypes, maxSize]
  );

  const processImage = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      const validation = validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 创建预览URL
      const preview = URL.createObjectURL(file);

      return {
        id: uuidv4(),
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    },
    [validateImage]
  );

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  return {
    validateImage,
    processImage,
    convertToBase64,
  };
};
