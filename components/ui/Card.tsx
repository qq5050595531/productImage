import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-800/50 border border-gray-700',
      gradient: 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50',
      glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6 shadow-xl',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
