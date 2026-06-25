"use client";

import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user } = useAuth();

  // Generate initials for avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <button className="md:hidden mr-4 text-foreground/70 hover:text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search projects, tasks, or members..."
            className="w-full bg-background border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/notifications">
          <button className="relative p-2 rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border border-card"></span>
          </button>
        </Link>

        <div className="h-8 w-px bg-border mx-2"></div>

        <Link href="/settings">
          <div className="flex items-center cursor-pointer group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-border group-hover:border-primary/50 transition-colors object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-border group-hover:border-primary/50 transition-colors bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-foreground/50">{user?.role || 'Member'}</p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
