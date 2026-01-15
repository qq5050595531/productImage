import type { GeneratedImage } from './image';

export interface GenerationRequest {
  productImages: string[];
  modelImages?: string[];
  referenceImages?: string[];
  prompt?: string;
  count?: number;
}

export interface GenerationResponse {
  success: boolean;
  images: GeneratedImage[];
  error?: string;
}

