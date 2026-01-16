import { GoogleGenerativeAI } from '@google/generative-ai';

const STORAGE_KEY_API = 'gemini_api_key';
const STORAGE_KEY_BASE_URL = 'gemini_base_url';

// 从 localStorage 获取 API Key
export const getApiKey = (): string => {
  if (typeof window === 'undefined') return '';

  const key = localStorage.getItem(STORAGE_KEY_API);
  if (!key) {
    throw new Error('请先在界面上配置 Gemini API Key');
  }

  return key;
};

// 从 localStorage 获取 Base URL
export const getBaseUrl = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const baseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL);
  return baseUrl || undefined;
};

// 检查是否已配置 API Key
export const hasApiKey = (): boolean => {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(STORAGE_KEY_API);
  return !!key && key.trim().length > 0;
};

// 创建 Gemini 客户端（每次调用时使用最新的 API Key）
export const createGeminiClient = (): GoogleGenerativeAI => {
  const apiKey = getApiKey();

  // 注意：Google Generative AI SDK 不支持直接自定义 fetch
  // 如果需要使用代理，请在 API 路由端实现代理逻辑
  return new GoogleGenerativeAI(apiKey);
};

// 获取图片模型
export const getImageModel = () => {
  const client = createGeminiClient();
  return client.getGenerativeModel({
    model: 'gemini-2.5-flash-image-preview',
  });
};
