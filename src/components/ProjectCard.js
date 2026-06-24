"use client";
import { Calendar, CheckSquare, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import ProgressBar from './ui/ProgressBar';
import { users } from '@/data/mockData';
import Link from 'next/link';

export default function ProjectCard({ project, index = 0 }) {
  const projectMembers = project.members.map(id => users.find(u => u.id === id)).filter(Boolean);

  const statusColors = {
    Active: 'primary',
    Completed: 'success',
    Pending: 'warning',
  };

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
            <Link href={`/projects/${project.id}/board`}>{project.name}</Link>
          </h3>
          <Badge variant={statusColors[project.status] || 'default'}>{project.status}</Badge>
        </div>
        <button className="text-foreground/40 hover:text-foreground/80 p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-foreground/60 mb-6 line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-foreground/60">Progress</span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar progress={project.progress} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex -space-x-2">
          {projectMembers.map((member, i) => (
            <Avatar key={member.id} src={member.avatar} alt={member.name} size="sm" className={`border-2 border-card relative z-[${10 - i}]`} />
          ))}
          {projectMembers.length === 0 && <span className="text-xs text-foreground/40">No members</span>}
        </div>

        <div className="flex space-x-3 text-xs text-foreground/50">
          <div className="flex items-center" title="Due Date">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {new Date(project.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center" title="Tasks">
            <CheckSquare className="w-3.5 h-3.5 mr-1" />
            {project.taskCount}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
