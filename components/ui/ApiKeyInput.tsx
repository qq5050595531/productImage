'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, Check, AlertCircle, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

const STORAGE_KEY_API = 'gemini_api_key';
const STORAGE_KEY_BASE_URL = 'gemini_base_url';

export const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 从 localStorage 加载保存的 API Key 和 Base URL
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY_API);
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }

    const savedBaseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL);
    if (savedBaseUrl) {
      setBaseUrl(savedBaseUrl);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('请输入 API Key');
      return;
    }

    // if (!apiKey.startsWith('AIza')) {
    //   setError('API Key 格式不正确，应该以 "AIza" 开头');
    //   return;
    // }

    localStorage.setItem(STORAGE_KEY_API, apiKey.trim());

    // 保存 Base URL（如果有）
    if (baseUrl.trim()) {
      localStorage.setItem(STORAGE_KEY_BASE_URL, baseUrl.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_BASE_URL);
    }

    setIsSaved(true);
    setError('');

    // 触发自定义事件，通知其他组件 API Key 已更新
    window.dispatchEvent(new Event('api-key-changed'));

    // 3秒后隐藏成功提示
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY_API);
    localStorage.removeItem(STORAGE_KEY_BASE_URL);
    setApiKey('');
    setBaseUrl('');
    setIsSaved(false);
    setError('');

    // 触发自定义事件，通知其他组件 API Key 已清除
    window.dispatchEvent(new Event('api-key-changed'));
  };

  return (
    <Card className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Gemini API Key</h3>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto flex items-center gap-1 text-green-400 text-sm"
          >
            <Check className="w-4 h-4" />
            已保存
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div className="relative">
          <input
            type={isVisible ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError('');
              setIsSaved(false);
            }}
            placeholder="请输入 Gemini API Key (以 AIza 开头)"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 pr-24 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-mono text-sm"
          />

          {/* Toggle Visibility Button */}
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
            title={isVisible ? '隐藏 API Key' : '显示 API Key'}
          >
            {isVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            size="sm"
            className="flex-1"
          >
            保存 API Key
          </Button>
          {apiKey && (
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
            >
              清除
            </Button>
          )}
        </div>

        {/* Advanced Settings Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-purple-400 transition-colors py-2 text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>高级设置</span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Advanced Settings Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Base URL（可选）
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="例如: https://api.example.com/v1beta"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-mono text-sm"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    如果需要使用代理或自定义 API 端点，请在此输入。留空则使用默认的 Google API endpoint。
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 text-sm mb-2">
            <strong>如何获取 API Key：</strong>
          </p>
          <ol className="text-purple-200 text-sm space-y-1 list-decimal list-inside">
            <li>访问 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google AI Studio</a></li>
            <li>登录你的 Google 账号</li>
            <li>点击 &quot;Create API Key&quot; 创建新的密钥</li>
            <li>复制 API Key 并粘贴到上方输入框</li>
          </ol>
          <p className="text-gray-400 text-xs mt-3">
            🔒 你的 API Key 仅保存在浏览器本地，不会上传到服务器
          </p>
        </div>
      </div>
    </Card>
  );
};
