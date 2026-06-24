"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { notifications } from '@/data/mockData';
import { Bell, CheckCircle2, MessageSquare, AtSign } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
  const getIcon = (type) => {
    switch (type) {
      case 'mention': return <AtSign className="w-5 h-5 text-violet-500" />;
      case 'assignment': return <CheckCircle2 className="w-5 h-5 text-mint-500" />;
      default: return <Bell className="w-5 h-5 text-foreground/50" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-foreground/60 text-sm mt-1">Stay updated with activity across your projects.</p>
        </div>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
              notification.read 
                ? 'bg-transparent border-border/50 opacity-70' 
                : 'bg-card border-border shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-xl mt-0.5 ${notification.read ? 'bg-foreground/5' : 'bg-primary/10'}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${notification.read ? 'text-foreground/70' : 'text-foreground font-medium'}`}>
                {notification.message}
              </p>
              <p className="text-xs text-foreground/50 mt-1">{notification.time}</p>
            </div>
            {!notification.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
