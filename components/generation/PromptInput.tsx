'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const promptTemplates = [
  {
    label: '专业产品拍摄',
    template: '创建专业的产品摄影照片，使用柔和的灯光和干净的背景，突出产品的细节和质感。',
  },
  {
    label: '生活方式场景',
    template: '将产品融入自然的生活场景中，展示产品的实际使用场景，营造温馨的氛围。',
  },
  {
    label: '时尚杂志风格',
    template: '使用时尚杂志风格的构图和光线，创造高端、奢华的产品展示效果。',
  },
  {
    label: '简约设计',
    template: '采用极简主义设计风格，使用大量留白和简洁的背景，突出产品本身。',
  },
  {
    label: '创意艺术',
    template: '创造充满创意和艺术感的产品图，使用独特的角度和视觉效果。',
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onGenerate,
  disabled = false,
  isLoading = false,
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleApplyTemplate = (template: string) => {
    onChange(value + (value ? ' ' : '') + template);
    setShowTemplates(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Card>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            自定义生成描述
            <span className="text-sm font-normal text-gray-400">(可选)</span>
          </label>
          <p className="text-gray-400 text-sm">
            添加额外的描述来指导 AI 生成更符合你需求的产品图
          </p>
        </div>

        {/* Template Suggestions */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="mb-3 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showTemplates ? '隐藏' : '显示'}预设模板
          </Button>

          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4"
            >
              {promptTemplates.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApplyTemplate(item.template)}
                  className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-left hover:bg-purple-500/20 transition-colors"
                >
                  <div className="text-white font-medium text-sm mb-1">
                    {item.label}
                  </div>
                  <div className="text-gray-400 text-xs line-clamp-2">
                    {item.template}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Text Input */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：使用温暖的灯光，将产品放置在木质桌面上，营造自然舒适的氛围..."
          disabled={disabled}
          rows={4}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm">
            {value.length} / 500 字符
          </span>
          <Button
            onClick={onGenerate}
            disabled={disabled}
            isLoading={isLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            生成产品图
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
