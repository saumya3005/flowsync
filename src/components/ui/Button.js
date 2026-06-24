"use client";

import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20',
    secondary: 'bg-foreground/5 text-foreground hover:bg-foreground/10',
    outline: 'border border-border bg-transparent hover:bg-foreground/5 text-foreground',
    ghost: 'bg-transparent hover:bg-foreground/5 text-foreground',
    danger: 'bg-coral/10 text-coral hover:bg-coral/20',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
