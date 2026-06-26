"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTasks } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskDrawer from '@/components/modals/TaskDrawer';
import { Loader2, Search, Filter } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function TasksPage() {
    const { tasks, loading } = useTasks();
    const [selectedTask, setSelectedTask] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredTasks = tasks.filter(t => {
      const matchesFilter = filter === 'All' || t.status === filter;
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

    const filterOptions = ['All', 'To Do', 'In Progress', 'Review', 'Completed'];

    return (
      <DashboardLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-foreground/60 text-sm mt-1">Manage all your assigned tasks across projects.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card border border-border p-3 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9 bg-background/50 border-none shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-foreground/40 ml-2 shrink-0" />
            {filterOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === opt 
                    ? 'bg-primary text-white shadow-sm shadow-primary/20' 
                    : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-foreground/50 text-sm">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="col-span-full py-20 text-center bg-card border border-border border-dashed rounded-2xl">
                <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-foreground/30" />
                </div>
                <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                <p className="text-foreground/50 text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        )}

        <TaskDrawer 
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      </DashboardLayout>
    );
}
// Import fix
import { CheckSquare } from 'lucide-react';