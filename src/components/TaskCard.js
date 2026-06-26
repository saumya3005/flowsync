"use client";
import { Clock, MessageSquare, Paperclip, CheckSquare } from 'lucide-react';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

export default function TaskCard({ task, onClick }) {
  const priorityColors = {
    High: 'destructive',
    Medium: 'warning',
    Low: 'success',
  };

  // Assume assignee is populated from backend { _id, name, avatar }
  const assignee = task.assignedTo;
  
  // Get counts for comments and attachments based on arrays or numeric fields
  const commentCount = Array.isArray(task.comments) ? task.comments.length : (task.commentCount || 0);
  const attachmentCount = Array.isArray(task.attachments) ? task.attachments.length : (task.attachmentCount || 0);

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <Badge variant={priorityColors[task.priority] || 'default'}>{task.priority}</Badge>
      </div>

      <h4 className="font-medium text-sm mb-2 leading-tight">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-foreground/50 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 text-xs text-foreground/50">
        <div className="flex items-center space-x-3">
          {commentCount > 0 && (
            <div className="flex items-center hover:text-primary transition-colors">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>{commentCount}</span>
            </div>
          )}
          {attachmentCount > 0 && (
            <div className="flex items-center hover:text-primary transition-colors">
              <Paperclip className="w-3.5 h-3.5 mr-1" />
              <span>{attachmentCount}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center text-coral/80">
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        {assignee && (
          <Avatar src={assignee.avatar} alt={assignee.name || 'User'} size="sm" title={assignee.name || 'User'} />
        )}
      </div>
    </div>
  );
}
