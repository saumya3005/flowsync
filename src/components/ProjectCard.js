"use client";
import { Calendar, CheckSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import ProgressBar from './ui/ProgressBar';
import Link from 'next/link';

export default function ProjectCard({ project, index = 0, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Members might be populated objects { _id, name, avatar } from backend
  const projectMembers = Array.isArray(project.members) ? project.members : [];

  const statusColors = {
    Active: 'primary',
    Completed: 'success',
    Pending: 'warning',
  };

  // Calculate progress based on tasks if backend doesn't provide it directly
  let progress = project.progress || 0;
  if (project.tasks && Array.isArray(project.tasks) && project.tasks.length > 0) {
    const completed = project.tasks.filter(t => t.status === 'Completed').length;
    progress = Math.round((completed / project.tasks.length) * 100);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            <Link href={`/projects/${project._id}/board`}>{project.name}</Link>
          </h3>
          <Badge variant={statusColors[project.status] || 'default'}>{project.status || 'Active'}</Badge>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-foreground/40 hover:text-foreground/80 p-1 rounded-lg hover:bg-foreground/5 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-1 w-36 bg-card border border-border shadow-lg rounded-xl z-10 py-1 overflow-hidden"
              >
                <button 
                  onClick={() => { setShowMenu(false); if (onEdit) onEdit(project); }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 flex items-center"
                >
                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                </button>
                <button 
                  onClick={() => { setShowMenu(false); if (onDelete) onDelete(project._id); }}
                  className="w-full text-left px-4 py-2 text-sm text-coral hover:bg-coral/10 flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mb-6 line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-foreground/60">Progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex -space-x-2">
          {projectMembers.map((member, i) => (
            <Avatar 
              key={member._id || i} 
              src={member.avatar} 
              alt={member.name || 'User'} 
              size="sm" 
              className={`border-2 border-card relative z-[${10 - i}]`} 
            />
          ))}
          {projectMembers.length === 0 && <span className="text-xs text-foreground/40">No members</span>}
        </div>

        <div className="flex space-x-3 text-xs text-foreground/50">
          {project.dueDate && (
            <div className="flex items-center" title="Due Date">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {new Date(project.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
          <div className="flex items-center" title="Tasks">
            <CheckSquare className="w-3.5 h-3.5 mr-1" />
            {project.taskCount || (project.tasks ? project.tasks.length : 0)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
