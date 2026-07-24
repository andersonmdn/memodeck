import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[--color-accent]/20 text-[--color-accent] border border-[--color-accent]/30',
        secondary: 'bg-[--color-surface-2] text-[--color-text-muted] border border-[--color-border]',
        success: 'bg-[--color-success]/20 text-[--color-success] border border-[--color-success]/30',
        warning: 'bg-[--color-warning]/20 text-[--color-warning] border border-[--color-warning]/30',
        danger: 'bg-[--color-danger]/20 text-[--color-danger] border border-[--color-danger]/30',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
