"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Video, Plus, Link2, Calendar, Users, ArrowRight, Loader2, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function MeetingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meetings');
        if (res.data.success) setMeetings(res.data.data);
      } catch (e) {}
      setLoading(false);
    };
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async () => {
    setCreating(true);
    try {
      const res = await api.post('/meetings', { title: `${user?.name}'s Meeting` });
      if (res.data.success) {
        router.push(`/meetings/${res.data.data.roomId}`);
      }
    } catch (e) {
      alert('Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      router.push(`/meetings/${joinRoomId.trim()}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <p className="text-foreground/60 text-sm mt-1">Start or join a video call with your team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Create Meeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-linear-to-br from-primary/80 to-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 right-8 w-24 h-24 bg-white/5 rounded-full -mb-8" />
          <Video className="w-10 h-10 mb-4 opacity-90" />
          <h2 className="text-xl font-bold mb-2">New Meeting</h2>
          <p className="text-white/70 text-sm mb-5">Start an instant video call and invite your team.</p>
          <Button
            onClick={handleCreateMeeting}
            disabled={creating}
            className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
          >
            {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            {creating ? 'Creating...' : 'Start Meeting'}
          </Button>
        </motion.div>

        {/* Join Meeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <Link2 className="w-10 h-10 mb-4 text-primary/70" />
          <h2 className="text-xl font-bold mb-2">Join a Meeting</h2>
          <p className="text-foreground/60 text-sm mb-5">Have a Room ID? Enter it to join the call.</p>
          <form onSubmit={handleJoinMeeting} className="flex gap-2">
            <input
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              placeholder="Enter Room ID..."
              value={joinRoomId}
              onChange={e => setJoinRoomId(e.target.value)}
            />
            <Button type="submit" disabled={!joinRoomId.trim()}>
              Join <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Recent Meetings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Meeting History</h2>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <Video className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="font-medium mb-1">No meetings yet</p>
            <p className="text-foreground/50 text-sm">Start your first meeting to see history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((m, i) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
              >
                <div className={`p-2.5 rounded-xl ${m.status === 'active' ? 'bg-green-500/10' : 'bg-foreground/5'}`}>
                  <Video className={`w-5 h-5 ${m.status === 'active' ? 'text-green-500' : 'text-foreground/40'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{m.title}</p>
                  <div className="flex items-center gap-3 text-xs text-foreground/50 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(m.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.participants?.length || 0} participants</span>
                    {m.projectId && <span className="truncate">{m.projectId.name}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-foreground/5 text-foreground/50'}`}>
                    {m.status}
                  </span>
                  <button
                    onClick={() => router.push(`/meetings/${m.roomId}`)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Rejoin
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
