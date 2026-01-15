import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GeneratedImage } from '../types';

interface GenerationStore {
  // 状态
  isGenerating: boolean;
  generatedImages: GeneratedImage[];
  currentProgress: number;
  progressStage: string;
  error: string | null;

  // 操作
  setGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: number, stage: string) => void;
  setGeneratedImages: (images: GeneratedImage[]) => void;
  addGeneratedImage: (image: GeneratedImage) => void;
  clearGeneratedImages: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationStore>()(
  devtools(
    (set) => ({
      // 初始状态
      isGenerating: false,
      generatedImages: [],
      currentProgress: 0,
      progressStage: '',
      error: null,

      // 操作
      setGenerating: (isGenerating) => set({ isGenerating, error: null }),

      setProgress: (progress, stage) =>
        set({ currentProgress: progress, progressStage: stage }),

      setGeneratedImages: (images) => set({ generatedImages: images }),

      addGeneratedImage: (image) =>
        set((state) => ({
          generatedImages: [...state.generatedImages, image],
        })),

      clearGeneratedImages: () => set({ generatedImages: [] }),

      setError: (error) => set({ error, isGenerating: false }),

      reset: () =>
        set({
          isGenerating: false,
          generatedImages: [],
          currentProgress: 0,
          progressStage: '',
          error: null,
        }),
    }),
    { name: 'generation-store' }
  )
);
