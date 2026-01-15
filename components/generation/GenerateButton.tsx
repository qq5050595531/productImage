'use client';

import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface GenerateButtonProps {
  isGenerating: boolean;
  hasImages: boolean;
  onGenerate: () => void;
  disabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  hasImages,
  onGenerate,
  disabled,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center my-8"
    >
      <motion.div
        whileHover={{ scale: isGenerating ? 1 : 1.05 }}
        whileTap={{ scale: isGenerating ? 1 : 0.95 }}
      >
        <Button
          onClick={onGenerate}
          disabled={disabled || !hasImages || isGenerating}
          isLoading={isGenerating}
          size="lg"
          className="relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isGenerating ? (
              <>
                <Spark className="w-5 h-5 animate-pulse" />
                生成中...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                生成产品图
              </>
            )}
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
            initial={{ x: '-100%' }}
            animate={isGenerating ? { x: ['0%', '100%'] } : { x: '-100%' }}
            transition={{
              duration: 2,
              repeat: isGenerating ? Infinity : 0,
              ease: 'linear',
            }}
          />
        </Button>
      </motion.div>
    </motion.div>
  );
};

const Spark = Sparkles;
