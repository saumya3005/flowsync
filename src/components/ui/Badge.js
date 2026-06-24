import { cn } from '@/utils/cn';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-foreground/10 text-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-mint/10 text-mint',
    warning: 'bg-peach/20 text-peach',
    danger: 'bg-coral/10 text-coral',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
