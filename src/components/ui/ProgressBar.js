import { cn } from '@/utils/cn';

export default function ProgressBar({ progress, className, indicatorClassName }) {
  return (
    <div className={cn('w-full h-2 bg-foreground/10 rounded-full overflow-hidden', className)}>
      <div
        className={cn('h-full bg-primary transition-all duration-500 ease-out', indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
