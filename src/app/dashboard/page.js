"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Plus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import { useTasks } from '@/context/TaskContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks();

  const recentProjects = projects?.slice(0, 4) || [];
  const recentTasks = tasks?.slice(0, 5) || [];

  const completedTasks = tasks?.filter(t => t.status === 'Completed').length || 0;
  const overdueTasks = tasks?.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length || 0;

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-foreground/60 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/team">
            <Button variant="outline">Invite Member</Button>
          </Link>
          <Link href="/projects">
            <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Projects"
          value={projectsLoading ? '-' : projects.length}
          trend="neutral"
          loading={projectsLoading}
        />
        <StatsCard
          title="Active Tasks"
          value={tasksLoading ? '-' : tasks.length - completedTasks}
          trend="up"
          loading={tasksLoading}
        />
        <StatsCard
          title="Tasks Completed"
          value={tasksLoading ? '-' : completedTasks}
          trend="up"
          loading={tasksLoading}
        />
        <StatsCard
          title="Overdue Tasks"
          value={tasksLoading ? '-' : overdueTasks}
          trend={overdueTasks > 0 ? 'down' : 'neutral'}
          loading={tasksLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Projects Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project, idx) => (
                <ProjectCard key={project._id} project={project} index={idx} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 py-12 text-center bg-card border border-border border-dashed rounded-2xl">
                <p className="text-foreground/50 mb-4">No projects yet. Get started by creating one!</p>
                <Link href="/projects">
                  <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Create Project</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <Link href="/tasks" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 h-full max-h-125 overflow-y-auto">
            {tasksLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonTask key={i} />)
            ) : recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <p className="text-foreground/40 text-sm">You have no tasks assigned to you right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, change, trend = 'neutral', loading }) {
  let changeClass = 'bg-foreground/5 text-foreground/60'; // neutral
  if (trend === 'up') changeClass = 'bg-mint/10 text-mint';
  if (trend === 'down') changeClass = 'bg-coral/10 text-coral';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-2xl border border-border/50 flex flex-col justify-between h-32"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
        <MoreHorizontal className="w-4 h-4 text-foreground/30" />
      </div>

      <div className="flex items-baseline gap-3">
        {loading ? (
          <div className="h-10 w-16 bg-foreground/5 animate-pulse rounded-lg"></div>
        ) : (
          <span className="text-4xl font-bold tracking-tight">{value}</span>
        )}
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${changeClass}`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/50 h-56 flex flex-col">
      <div className="flex justify-between mb-4">
        <div>
          <div className="h-6 w-32 bg-foreground/5 animate-pulse rounded-md mb-2"></div>
          <div className="h-5 w-16 bg-foreground/5 animate-pulse rounded-full"></div>
        </div>
      </div>
      <div className="space-y-2 mb-auto mt-2">
        <div className="h-3 w-full bg-foreground/5 animate-pulse rounded"></div>
        <div className="h-3 w-4/5 bg-foreground/5 animate-pulse rounded"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50 flex justify-between">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-foreground/10 animate-pulse border-2 border-card"></div>
          <div className="w-7 h-7 rounded-full bg-foreground/10 animate-pulse border-2 border-card"></div>
        </div>
        <div className="h-4 w-12 bg-foreground/5 animate-pulse rounded"></div>
      </div>
    </div>
  );
}

function SkeletonTask() {
  return (
    <div className="bg-background border border-border rounded-xl p-4 shadow-sm h-32 flex flex-col justify-between">
      <div className="h-5 w-20 bg-foreground/5 animate-pulse rounded-full mb-2"></div>
      <div className="h-4 w-3/4 bg-foreground/5 animate-pulse rounded mb-2"></div>
      <div className="flex justify-between mt-auto pt-3 border-t border-border/50">
        <div className="h-4 w-16 bg-foreground/5 animate-pulse rounded"></div>
        <div className="h-6 w-6 rounded-full bg-foreground/10 animate-pulse"></div>
      </div>
    </div>
  );
}
