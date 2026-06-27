"use client";

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bell, CheckCircle2, MessageSquare, AtSign, Loader2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useSocket } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newNotification', (n) => setNotifications(prev => [n, ...prev]));
    socket.on('notificationCreated', (n) => setNotifications(prev => [n, ...prev]));
    return () => { socket.off('newNotification'); socket.off('notificationCreated'); };
  }, [socket]);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'mention': return <AtSign className="w-5 h-5 text-violet" />;
      case 'assignment': return <CheckCircle2 className="w-5 h-5 text-mint" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-foreground/50" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary text-white rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">Stay updated with activity across your projects.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2">
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
            <h3 className="text-lg font-medium mb-1">All caught up!</h3>
            <p className="text-foreground/50 text-sm">You have no notifications right now.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.isRead && markOneAsRead(n._id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  n.isRead
                    ? 'bg-transparent border-border/40 opacity-60'
                    : 'bg-card border-border shadow-sm hover:border-primary/30'
                }`}
              >
                <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${n.isRead ? 'bg-foreground/5' : 'bg-primary/10'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${n.isRead ? 'text-foreground/60' : 'text-foreground font-medium'}`}>
                    {n.message}
                  </p>
                  {(n.relatedProject || n.relatedTask) && (
                    <p className="text-xs text-foreground/40 mt-0.5 truncate">
                      {n.relatedProject?.title && `Project: ${n.relatedProject.title}`}
                      {n.relatedTask?.title && ` · Task: ${n.relatedTask.title}`}
                    </p>
                  )}
                  <p className="text-xs text-foreground/40 mt-1">
                    {new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}
