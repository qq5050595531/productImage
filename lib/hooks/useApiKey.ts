'use client';

import { useState, useEffect } from 'react';
import { hasApiKey, getApiKey } from '../gemini/client';

export const useApiKey = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // 检查 API Key 是否已配置
  const checkApiKey = () => {
    const configured = hasApiKey();
    setIsConfigured(configured);
    if (configured) {
      setApiKey(getApiKey());
    }
    return configured;
  };

  // 初始化时检查
  useEffect(() => {
    checkApiKey();
  }, []);

  // 监听 storage 事件（其他标签页修改时同步）
  useEffect(() => {
    const handleStorageChange = () => {
      checkApiKey();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    isConfigured,
    apiKey,
    checkApiKey,
  };
};
