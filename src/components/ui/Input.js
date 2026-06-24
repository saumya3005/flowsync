import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

const Input = forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-coral focus:ring-coral/50',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
