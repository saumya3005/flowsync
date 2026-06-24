import { cn } from '@/utils/cn';

export default function Avatar({ src, alt, size = 'md', status, className }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const statusColors = {
    online: 'bg-mint',
    offline: 'bg-foreground/30',
    busy: 'bg-coral',
    away: 'bg-peach',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover border border-border', sizes[size])}
      />
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            statusColors[status],
            size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          )}
        />
      )}
    </div>
  );
}
