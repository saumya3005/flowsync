import { Send } from 'lucide-react';
import Avatar from './ui/Avatar';
import { currentUser } from '@/data/mockData';

export default function CommentBox({ comments = [] }) {
  return (
    <div className="flex flex-col space-y-4">
      {/* Existing Comments list (placeholder structure) */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {comments.map((comment, i) => (
          <div key={i} className="flex space-x-3">
             <Avatar src={comment.user.avatar} size="sm" />
             <div className="flex-1 bg-foreground/5 rounded-2xl rounded-tl-none p-3 text-sm">
               <div className="flex justify-between items-center mb-1">
                 <span className="font-medium">{comment.user.name}</span>
                 <span className="text-xs text-foreground/50">{comment.time}</span>
               </div>
               <p className="text-foreground/80">{comment.text}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex space-x-3 items-end pt-4 border-t border-border">
        <Avatar src={currentUser.avatar} size="sm" className="mb-1" />
        <div className="flex-1 relative">
          <textarea
            placeholder="Write a comment..."
            className="w-full bg-background border border-border rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none min-h-11 max-h-32"
            rows="1"
          />
          <button className="absolute right-2 bottom-2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
