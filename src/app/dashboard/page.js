"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectCard from '@/components/ProjectCard';
import { projects, tasks } from '@/data/mockData';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';

export default function Dashboard() {
  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-foreground/60 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Invite Member</Button>
          <Link href="/projects">
            <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Projects" value="12" change="+2" />
        <StatsCard title="Tasks Completed" value="148" change="+14" trend="up" />
        <StatsCard title="Upcoming Deadlines" value="4" change="-1" trend="down" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Projects Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <Link href="/tasks" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 h-full max-h-125 overflow-y-auto">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, change, trend = 'up' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-2xl border border-border/50"
    >
      <h3 className="text-sm font-medium text-foreground/60 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-mint/10 text-mint' : 'bg-coral/10 text-coral'}`}>
          {change}
        </span>
      </div>
    </motion.div>
  );
}
