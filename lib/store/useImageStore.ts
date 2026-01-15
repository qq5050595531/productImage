import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UploadedImage } from '../types';

interface ImageStore {
  // 状态
  productImages: UploadedImage[];
  modelImages: UploadedImage[];
  referenceImages: UploadedImage[];

  // 操作 - 产品图
  addProductImage: (image: UploadedImage) => void;
  removeProductImage: (id: string) => void;
  clearProductImages: () => void;

  // 操作 - 模特图
  addModelImage: (image: UploadedImage) => void;
  removeModelImage: (id: string) => void;
  clearModelImages: () => void;

  // 操作 - 参考图
  addReferenceImage: (image: UploadedImage) => void;
  removeReferenceImage: (id: string) => void;
  clearReferenceImages: () => void;

  // 工具方法
  clearAllImages: () => void;
  getTotalImageCount: () => number;
}

export const useImageStore = create<ImageStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      productImages: [],
      modelImages: [],
      referenceImages: [],

      // 产品图操作
      addProductImage: (image) =>
        set((state) => ({
          productImages: [...state.productImages, image],
        })),

      removeProductImage: (id) =>
        set((state) => ({
          productImages: state.productImages.filter((img) => img.id !== id),
        })),

      clearProductImages: () => set({ productImages: [] }),

      // 模特图操作
      addModelImage: (image) =>
        set((state) => ({
          modelImages: [...state.modelImages, image],
        })),

      removeModelImage: (id) =>
        set((state) => ({
          modelImages: state.modelImages.filter((img) => img.id !== id),
        })),

      clearModelImages: () => set({ modelImages: [] }),

      // 参考图操作
      addReferenceImage: (image) =>
        set((state) => ({
          referenceImages: [...state.referenceImages, image],
        })),

      removeReferenceImage: (id) =>
        set((state) => ({
          referenceImages: state.referenceImages.filter((img) => img.id !== id),
        })),

      clearReferenceImages: () => set({ referenceImages: [] }),

      // 工具方法
      clearAllImages: () =>
        set({
          productImages: [],
          modelImages: [],
          referenceImages: [],
        }),

      getTotalImageCount: () => {
        const state = get();
        return (
          state.productImages.length +
          state.modelImages.length +
          state.referenceImages.length
        );
      },
    }),
    { name: 'image-store' }
  )
);
