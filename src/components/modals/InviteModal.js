"use client";

import { X, Send, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useProjects } from '@/context/ProjectContext';

export default function InviteModal({ isOpen, onClose }) {
  const { projects } = useProjects();
  const [identifier, setIdentifier] = useState('');
  const [projectId, setProjectId] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const handleInvite = async () => {
    if (!identifier || !projectId) {
      setError('Please provide an email or phone number and select a project.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = identifier.includes('@') ? { email: identifier, role } : { phone: identifier, role };
      const res = await api.post(`/projects/${projectId}/invite`, payload);
      if (res.data.success) {
        setSuccess('Invitation sent successfully!');
        setIdentifier('');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="flex justify-between items-center p-5 border-b border-border/50">
                <h3 className="text-lg font-bold">Invite Member</h3>
                <button onClick={onClose} className="text-foreground/50 hover:text-foreground hover:bg-foreground/5 p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-xl">{error}</div>}
                {success && <div className="p-3 bg-mint/10 text-mint text-sm rounded-xl">{success}</div>}

                <div>
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2 block">Project to Join</label>
                  <select 
                    value={projectId} 
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title || p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2 block">Email or Phone Number</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                      type="text"
                      placeholder="user@example.com or +1234567890"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2 block">Assign Role</label>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  >
                    {['Owner', 'Admin', 'Manager', 'Developer', 'Viewer'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button onClick={handleInvite} disabled={loading || !identifier}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Invite
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
