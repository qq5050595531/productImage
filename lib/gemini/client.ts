import { GoogleGenerativeAI } from '@google/generative-ai';

const STORAGE_KEY = 'gemini_api_key';

// 从 localStorage 获取 API Key
export const getApiKey = (): string => {
  if (typeof window === 'undefined') return '';

  const key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    throw new Error('请先在界面上配置 Gemini API Key');
  }

  return key;
};

// 检查是否已配置 API Key
export const hasApiKey = (): boolean => {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(STORAGE_KEY);
  return !!key && key.startsWith('AIza');
};

// 创建 Gemini 客户端（每次调用时使用最新的 API Key）
export const createGeminiClient = (): GoogleGenerativeAI => {
  const apiKey = getApiKey();
  return new GoogleGenerativeAI(apiKey);
};

// 获取图片模型
export const getImageModel = () => {
  const client = createGeminiClient();
  return client.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });
};
