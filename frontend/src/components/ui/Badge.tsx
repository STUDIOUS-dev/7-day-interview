import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'applied' | 'screening' | 'interviewing' | 'shortlisted' | 'rejected';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'applied', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide';
    
    const variants = {
      applied: 'bg-text-muted/20 text-text-primary',
      screening: 'bg-warning/20 text-warning border border-warning/30',
      interviewing: 'bg-accent-muted text-accent-primary border border-accent-primary/30',
      shortlisted: 'bg-success/20 text-success border border-success/30',
      rejected: 'bg-danger/20 text-danger border border-danger/30',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
