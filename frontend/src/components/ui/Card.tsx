import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'rounded-xl p-6 border transition-all duration-200';
    
    const variants = {
      default: 'bg-bg-surface border-border-subtle shadow-card',
      elevated: 'bg-bg-elevated border-border-subtle shadow-glow',
      interactive: 'bg-bg-surface border-border-subtle shadow-card hover:border-border-active hover:-translate-y-0.5 cursor-pointer',
    };

    if (variant === 'interactive') {
      return (
        <motion.div
          ref={ref as any}
          whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          className={cn(baseStyles, variants[variant], className)}
          {...(props as any)}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };

