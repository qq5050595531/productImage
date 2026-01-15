'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GenerationProgressProps {
  progress: number;
  stage: string;
  className?: string;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  stage,
  className,
}) => {
  if (progress === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('w-full max-w-md mx-auto mb-8', className)}
    >
      <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">{stage}</span>
          <span className="text-purple-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
