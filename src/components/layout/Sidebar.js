"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Bell, Settings, LogOut, Hexagon, Video } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Meetings', href: '/meetings', icon: Video },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0 pt-4">
      <div className="flex items-center px-6 mb-8 text-primary">
        <Hexagon className="w-8 h-8 mr-2 fill-primary/20" />
        <span className="text-xl font-bold tracking-wider text-foreground">FlowSync</span>
      </div>

      <div className="px-4 pb-4">
        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-4 px-2">Main Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer mb-1',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-5 h-5 mr-3', isActive ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/80')} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-6">
        {/* User info card */}
        {user && (
          <div className="glass-card rounded-2xl p-4 mb-4 flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full border border-border object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-foreground/50 truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-foreground/70 hover:bg-coral/10 hover:text-coral rounded-xl transition-colors cursor-pointer group"
        >
          <LogOut className="w-5 h-5 mr-3 text-foreground/50 group-hover:text-coral" />
          Logout
        </button>
      </div>
    </aside>
  );
}
