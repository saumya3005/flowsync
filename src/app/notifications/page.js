"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bell, CheckCircle2, MessageSquare, AtSign, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useSocket } from '@/context/SocketContext';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('newNotification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await api.put('/notifications/mark-read');
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'mention': return <AtSign className="w-5 h-5 text-violet-500" />;
      case 'assignment': return <CheckCircle2 className="w-5 h-5 text-mint-500" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500" />;
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
        <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-foreground/50 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
           <div className="text-center py-20 bg-card border border-border border-dashed rounded-2xl">
             <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-foreground/30" />
              </div>
              <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
              <p className="text-foreground/50 text-sm">When you receive mentions or task updates, they will appear here.</p>
           </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id} 
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
                <p className="text-xs text-foreground/50 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0"></div>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
