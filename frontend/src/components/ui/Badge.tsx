import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-600 text-white hover:bg-primary-600/80',
        secondary: 'border-transparent bg-bg text-text hover:bg-bg/80',
        destructive: 'border-transparent bg-danger text-white hover:bg-danger/80',
        outline: 'text-text',
        success: 'border-transparent bg-success text-white hover:bg-success/80',
        warning: 'border-transparent bg-warning text-white hover:bg-warning/80',
        info: 'border-transparent bg-info text-white hover:bg-info/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
