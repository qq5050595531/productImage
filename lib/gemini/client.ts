import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set');
}

export const geminiClient = new GoogleGenerativeAI(API_KEY || '');

export const getImageModel = () => {
  return geminiClient.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });
};
