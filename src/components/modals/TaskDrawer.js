"use client";

import { X, Clock, MessageSquare, CheckSquare, MoreHorizontal, Send, Plus, Loader2, Check, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const PRIORITY_COLORS = { Critical: 'destructive', High: 'destructive', Medium: 'warning', Low: 'success' };

export default function TaskDrawer({ isOpen, onClose, task, onUpdate }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liveTask, setLiveTask] = useState(task);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);

  useEffect(() => {
    setLiveTask(task);
    if (task?._id && isOpen) {
      fetchComments(task._id);
    }
  }, [task, isOpen]);

  const fetchComments = async (taskId) => {
    try {
      const res = await api.get(`/comments/task/${taskId}`);
      if (res.data.success) setComments(res.data.data);
    } catch (e) {}
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post('/comments', { taskId: liveTask._id, content: newComment });
      if (res.data.success) {
        setComments(prev => [...prev, res.data.data]);
        setNewComment('');
      }
    } catch (e) {}
    setCommentLoading(false);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    setAddingSubtask(true);
    try {
      const updated = { ...liveTask, subtasks: [...(liveTask.subtasks || []), { title: newSubtask, completed: false }] };
      const res = await api.put(`/tasks/${liveTask._id}`, { subtasks: updated.subtasks });
      if (res.data.success) {
        setLiveTask(res.data.data);
        if (onUpdate) onUpdate(res.data.data);
        setNewSubtask('');
      }
    } catch (e) {}
    setAddingSubtask(false);
  };

  const handleToggleSubtask = async (index) => {
    const newSubtasks = (liveTask.subtasks || []).map((st, i) =>
      i === index ? { ...st, completed: !st.completed } : st
    );
    try {
      const res = await api.put(`/tasks/${liveTask._id}`, { subtasks: newSubtasks });
      if (res.data.success) {
        setLiveTask(res.data.data);
        if (onUpdate) onUpdate(res.data.data);
      }
    } catch (e) {}
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.patch(`/tasks/${liveTask._id}/status`, { status: newStatus });
      if (res.data.success) {
        setLiveTask({ ...liveTask, status: newStatus });
        if (onUpdate) onUpdate({ ...liveTask, status: newStatus });
      }
    } catch (e) {}
  };

  const startMeeting = async () => {
    try {
      const res = await api.post('/meetings', { title: `Meeting: ${liveTask?.title}` });
      if (res.data.success) {
        router.push(`/meetings/${res.data.data.roomId}`);
      }
    } catch (e) {}
  };

  const subtasks = liveTask?.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                {liveTask?.priority && <Badge variant={PRIORITY_COLORS[liveTask.priority] || 'default'}>{liveTask.priority}</Badge>}
                {/* Status selector */}
                <select
                  value={liveTask?.status || 'To Do'}
                  onChange={e => handleStatusChange(e.target.value)}
                  className="text-xs bg-foreground/5 border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                >
                  {['To Do', 'In Progress', 'Review', 'Completed'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={startMeeting} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors">
                  <Video className="w-3.5 h-3.5" /> Start Meeting
                </button>
                <button onClick={onClose} className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-7">
                {/* Title */}
                <h2 className="text-xl font-bold leading-tight">{liveTask?.title}</h2>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider mb-1.5">Assignee</p>
                    <div className="flex items-center gap-2">
                      {liveTask?.assignedTo ? (
                        <>
                          <Avatar src={liveTask.assignedTo.avatar} size="sm" />
                          <span className="text-sm">{liveTask.assignedTo.name}</span>
                        </>
                      ) : <span className="text-foreground/40 italic text-sm">Unassigned</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider mb-1.5">Due Date</p>
                    <div className={`flex items-center gap-1.5 text-sm ${liveTask?.dueDate && new Date(liveTask.dueDate) < new Date() && liveTask.status !== 'Completed' ? 'text-red-500 font-medium' : ''}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {liveTask?.dueDate ? new Date(liveTask.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No date'}
                    </div>
                  </div>
                  {liveTask?.project?.name && (
                    <div>
                      <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider mb-1.5">Project</p>
                      <span className="text-sm text-foreground/80">{liveTask.project.name}</span>
                    </div>
                  )}
                  {liveTask?.labels?.length > 0 && (
                    <div>
                      <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider mb-1.5">Labels</p>
                      <div className="flex flex-wrap gap-1">
                        {liveTask.labels.map(l => (
                          <span key={l} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-2">Description</p>
                  <div className="bg-foreground/3 border border-border/50 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed min-h-20">
                    {liveTask?.description || <span className="text-foreground/30 italic">No description</span>}
                  </div>
                </div>

                {/* Subtasks / Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5" /> Checklist
                      {subtasks.length > 0 && (
                        <span className="ml-1 text-foreground/60">{completedSubtasks}/{subtasks.length}</span>
                      )}
                    </p>
                  </div>
                  {subtasks.length > 0 && (
                    <div className="mb-2">
                      {/* Progress bar */}
                      <div className="h-1 bg-foreground/10 rounded-full mb-3 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {subtasks.map((st, i) => (
                          <button
                            key={i}
                            onClick={() => handleToggleSubtask(i)}
                            className="flex items-center gap-3 w-full text-left hover:bg-foreground/3 p-2 rounded-lg group"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${st.completed ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}>
                              {st.completed && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className={`text-sm ${st.completed ? 'line-through text-foreground/40' : ''}`}>{st.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <input
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                      placeholder="Add checklist item..."
                      value={newSubtask}
                      onChange={e => setNewSubtask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    />
                    <button
                      onClick={handleAddSubtask}
                      disabled={addingSubtask}
                      className="px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 border border-border rounded-lg text-sm font-medium transition-colors"
                    >
                      {addingSubtask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.length})
                  </p>
                  <div className="space-y-4 mb-4">
                    {comments.length === 0 && (
                      <p className="text-sm text-foreground/40 italic text-center py-4">No comments yet. Start the conversation!</p>
                    )}
                    {comments.map(c => (
                      <div key={c._id} className="flex gap-3">
                        <Avatar src={c.author?.avatar} size="sm" className="shrink-0 mt-0.5" />
                        <div className="flex-1 bg-foreground/3 rounded-xl px-3 py-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold">{c.author?.name || 'User'}</span>
                            <span className="text-xs text-foreground/40">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Avatar src={user?.avatar} size="sm" className="shrink-0 mt-0.5" />
                    <div className="flex-1 flex gap-2">
                      <input
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); }}}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {commentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
