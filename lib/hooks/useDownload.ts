'use client';

import JSZip from 'jszip';
import type { GeneratedImage } from '../types';

export const useDownload = () => {
  const downloadImage = (base64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleImage = (image: GeneratedImage, index: number) => {
    const filename = `generated-image-${index + 1}-${image.timestamp}.png`;
    downloadImage(image.base64, filename);
  };

  const downloadAllImages = async (images: GeneratedImage[]) => {
    if (images.length === 0) return;

    if (images.length === 1) {
      downloadSingleImage(images[0], 1);
      return;
    }

    try {
      const zip = new JSZip();
      const folder = zip.folder('generated-images');

      images.forEach((image, index) => {
        const base64Data = image.base64.split(',')[1];
        const filename = `image-${index + 1}-${image.timestamp}.png`;
        folder?.file(filename, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      downloadImage(url, `generated-images-${Date.now()}.zip`);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download all images:', error);
      alert('下载失败，请重试');
    }
  };

  return {
    downloadSingleImage,
    downloadAllImages,
  };
};
