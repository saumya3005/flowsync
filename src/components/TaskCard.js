import { Paperclip, MessageSquare, Clock } from 'lucide-react';
import { users } from '@/data/mockData';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';

export default function TaskCard({ task, onClick }) {
  const assignee = users.find(u => u.id === task.assigneeId);

  const priorityColors = {
    Low: 'default',
    Medium: 'warning',
    High: 'danger',
  };

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
      </div>

      <h4 className="font-medium text-sm mb-2 leading-tight">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-foreground/50 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center space-x-3 text-foreground/40 text-xs">
          {task.comments > 0 && (
            <div className="flex items-center hover:text-primary transition-colors">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>{task.comments}</span>
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center hover:text-primary transition-colors">
              <Paperclip className="w-3.5 h-3.5 mr-1" />
              <span>{task.attachments}</span>
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
          <Avatar src={assignee.avatar} alt={assignee.name} size="sm" title={assignee.name} />
        )}
      </div>
    </div>
  );
}
