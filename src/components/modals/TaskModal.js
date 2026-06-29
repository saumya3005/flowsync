"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { useProjects } from '@/context/ProjectContext';
import api from '@/lib/api';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Review', 'Completed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export default function TaskModal({ isOpen, onClose, onSubmit, initialData = null, title = 'New Task' }) {
  const { projects } = useProjects();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', projectId: '', assignedTo: '',
    status: 'To Do', priority: 'Medium', dueDate: '', labels: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        projectId: initialData.project?._id || initialData.project || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        status: initialData.status || 'To Do',
        priority: initialData.priority || 'Medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
        labels: Array.isArray(initialData.labels) ? initialData.labels.join(', ') : '',
      });
    } else {
      setForm({ title: '', description: '', projectId: projects[0]?._id || '', assignedTo: '', status: 'To Do', priority: 'Medium', dueDate: '', labels: '' });
    }
  }, [initialData, isOpen, projects]);

  useEffect(() => {
    const fetchUsers = async () => {
      try { const res = await api.get('/users'); if (res.data.success) setUsers(res.data.data); }
      catch (e) {}
    };
    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      ...form,
      labels: form.labels ? form.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
    };
    onSubmit(payload);
  };

  const inputClass = "w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-border/50">
              <h2 className="text-base font-semibold">{title}</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/50 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center text-foreground/60 text-sm">
                <p className="mb-4">You must create a project first before creating a task.</p>
                <Link href="/projects" onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                  Go to Projects
                </Link>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/70">Title *</label>
                <Input autoFocus placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/70">Description</label>
                <textarea
                  className={`${inputClass} resize-none min-h-20`}
                  placeholder="What needs to be done?"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground/70">Project *</label>
                  <select className={inputClass} value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required>
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground/70">Assign To</label>
                  <select className={inputClass} value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground/70">Status</label>
                  <select className={inputClass} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground/70">Priority</label>
                  <select className={inputClass} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/70">Due Date</label>
                <Input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-foreground/70">Labels <span className="text-foreground/40">(comma separated)</span></label>
                <Input placeholder="e.g. frontend, bug, urgent" value={form.labels} onChange={e => setForm({...form, labels: e.target.value})} />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-border/50">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Task</Button>
              </div>
            </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
