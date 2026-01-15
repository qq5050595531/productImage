export const buildGenerationPrompt = (
  hasProductImage: boolean,
  hasModelImage: boolean,
  hasReferenceImage: boolean,
  customPrompt?: string
): string => {
  let prompt = '你是一个专业的产品图片生成器。';

  if (hasProductImage) {
    prompt += '基于提供的产品图片，生成创意产品拍摄图。';
  }

  if (hasModelImage) {
    prompt += '将产品自然地与模特图片整合，创造真实的产品展示效果。';
  }

  if (hasReferenceImage) {
    prompt += '使用参考图片作为构图和美学的风格指南。';
  }

  prompt += '创造视觉上吸引人、专业质量的产品照片，具有出色的光影和构图。';

  if (customPrompt) {
    prompt += `\n\n额外要求: ${customPrompt}`;
  }

  return prompt;
};

export const convertBase64ToGeminiFormat = (base64: string) => {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 format');
  }

  const mimeType = matches[1];
  const data = matches[2];

  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};
