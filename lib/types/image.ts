export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface GeneratedImage {
  id: string;
  base64: string;
  timestamp: number;
}
