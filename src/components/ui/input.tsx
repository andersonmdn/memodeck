import * as React from 'react'
import { cn } from '@/utils/cn'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-[--color-border] bg-[--color-surface] px-3 py-1 text-sm text-[--color-text] placeholder:text-[--color-text-subtle] focus:outline-none focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-1 focus:ring-offset-[--color-background] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
