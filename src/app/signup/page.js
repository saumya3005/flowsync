"use client";

import Link from 'next/link';
import { Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center text-primary font-bold text-xl mb-10">
            <Zap className="w-6 h-6 mr-2 fill-primary" />
            FlowSync
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-foreground/60 text-sm mb-8">Start managing your projects efficiently today.</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Full Name</label>
              <Input type="text" placeholder="Alex Rivera" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email</label>
              <Input type="email" placeholder="alex@flowsync.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">Role</label>
              <select className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
                <option>Developer</option>
                <option>Product Manager</option>
                <option>Designer</option>
                <option>Student</option>
                <option>Other</option>
              </select>
            </div>

            <Link href="/dashboard" className="block pt-4">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex flex-1 bg-charcoal relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-bl from-mint/20 to-midnight"></div>
        <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary/20 rounded-full blur-[120px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-card p-10 rounded-3xl max-w-lg w-full shadow-2xl text-center border border-white/10 text-white"
        >
          <Zap className="w-12 h-12 mx-auto mb-6 fill-mint text-mint" />
          <h2 className="text-2xl font-bold mb-4">Join thousands of teams</h2>
          <p className="text-white/70 leading-relaxed mb-8">
            "FlowSync completely transformed how our engineering and design teams collaborate. We launch 30% faster now."
          </p>
          <div className="flex items-center justify-center">
            <div className="flex -space-x-3 mr-4">
              <div className="w-8 h-8 rounded-full bg-coral border-2 border-charcoal"></div>
              <div className="w-8 h-8 rounded-full bg-peach border-2 border-charcoal"></div>
              <div className="w-8 h-8 rounded-full bg-mint border-2 border-charcoal"></div>
            </div>
            <span className="text-sm font-medium text-white/80">Trusted by top tech companies</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
