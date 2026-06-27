import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'link' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, children, disabled, ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-active disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-accent-primary text-bg-base hover:bg-accent-hover',
      ghost: 'bg-transparent text-text-primary hover:bg-bg-elevated border border-border-subtle hover:border-border-active',
      danger: 'bg-danger text-bg-base hover:bg-red-500',
      link: 'bg-transparent text-accent-primary hover:underline underline-offset-4',
      outline: 'bg-transparent border border-border-subtle text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
      secondary: 'bg-bg-elevated text-text-primary border border-border-subtle hover:border-border-active',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs',
      md: 'h-10 px-6 py-2.5 text-sm',
      lg: 'h-12 px-8 text-base',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
