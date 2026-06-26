import { X, Clock, AlertCircle, MessageSquare, Paperclip, CheckSquare, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import CommentBox from '@/components/CommentBox';
import Button from '@/components/ui/Button';

export default function TaskDrawer({ isOpen, onClose, task }) {
  if (!task) return null;

  const priorityColors = {
    High: 'destructive',
    Medium: 'warning',
    Low: 'success',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Badge variant={priorityColors[task.priority] || 'default'}>{task.priority}</Badge>
                <Badge>{task.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Title Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-foreground/50 font-medium text-xs uppercase tracking-wider">Assignee</span>
                    <div className="flex items-center gap-2">
                      {task.assignedTo ? (
                        <>
                          <Avatar src={task.assignedTo.avatar} size="sm" />
                          <span>{task.assignedTo.name || 'User'}</span>
                        </>
                      ) : (
                        <span className="text-foreground/40 italic">Unassigned</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-foreground/50 font-medium text-xs uppercase tracking-wider">Due Date</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-coral" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Description
                </h3>
                <div className="bg-background/50 border border-border/50 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed min-h-25">
                  {task.description || <span className="text-foreground/40 italic">No description provided.</span>}
                </div>
              </div>

              {/* Subtasks Placeholder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" /> Subtasks
                  </h3>
                  <span className="text-xs text-foreground/50">0/0</span>
                </div>
                <Button variant="outline" size="sm" className="w-full justify-start text-foreground/60 border-dashed">
                  + Add subtask
                </Button>
              </div>

              {/* Comments & Activity */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" /> Activity
                </h3>
                {/* Ensure commentBox works gracefully with empty comments */}
                <CommentBox comments={Array.isArray(task.comments) ? task.comments : []} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
