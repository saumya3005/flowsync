"use client";

import Link from 'next/link';
import { Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center text-primary font-bold text-xl mb-12">
            <Zap className="w-6 h-6 mr-2 fill-primary" />
            FlowSync
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-foreground/60 text-sm mb-8">Enter your details to access your account.</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email</label>
              <Input type="email" placeholder="alex@flowsync.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                <span className="text-foreground/70">Remember me</span>
              </label>
              <Link href="#" className="text-primary hover:underline font-medium">Forgot password?</Link>
            </div>

            <Link href="/dashboard" className="block pt-2">
              <Button className="w-full">Sign In</Button>
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex flex-1 bg-charcoal relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-violet-dark/40 to-midnight"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-card p-8 rounded-3xl max-w-md w-full shadow-2xl border border-white/10"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white font-bold mr-4">AL</div>
            <div>
              <p className="font-semibold text-white">Alex logged in</p>
              <p className="text-xs text-white/60">Just now</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
            <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
            <div className="h-4 bg-white/10 rounded-full w-5/6"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
