"use client";

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTasks } from '@/context/TaskContext';
import { useProjects } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import TaskDrawer from '@/components/modals/TaskDrawer';
import TaskModal from '@/components/modals/TaskModal';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Search, Filter, Plus, Edit, Trash2,
  ChevronDown, SortAsc, Circle, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const STATUS_OPTIONS = ['All', 'To Do', 'In Progress', 'Review', 'Completed'];
const PRIORITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
];
const PRIORITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const PRIORITY_COLORS = {
  Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Low: 'bg-green-500/10 text-green-600 border-green-500/20',
};
const STATUS_ICONS = {
  'To Do': <Circle className="w-4 h-4 text-foreground/40" />,
  'In Progress': <Clock className="w-4 h-4 text-blue-500" />,
  'Review': <AlertCircle className="w-4 h-4 text-yellow-500" />,
  'Completed': <CheckCircle2 className="w-4 h-4 text-green-500" />,
};

export default function TasksPage() {
  const { tasks, loading, addTask, updateTaskInState, removeTask } = useTasks();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [deleting, setDeleting] = useState(null);

  const filteredTasks = tasks
    .filter(t => {
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchPriority && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
      if (sortBy === 'dueDate') return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const openCreate = () => { setSelectedTask(null); setModalMode('create'); setIsModalOpen(true); };
  const openEdit = (task, e) => { e.stopPropagation(); setSelectedTask(task); setModalMode('edit'); setIsModalOpen(true); };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const res = await api.post('/tasks', formData);
        if (res.data.success) {
          // Re-fetch with populated fields so project.title renders correctly
          const populated = await api.get(`/tasks/${res.data.data._id}`);
          addTask(populated.data.data);
          setIsModalOpen(false);
        }
      } else {
        const res = await api.put(`/tasks/${selectedTask._id}`, formData);
        if (res.data.success) {
          updateTaskInState(res.data.data);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (taskId, e) => {
    e.stopPropagation();

    setDeleting(taskId);

    try {
      const res = await api.delete(`/tasks/${taskId}`);

      if (res.data.success) {
        removeTask(taskId);
      }
    } catch (err) {
      console.log("Delete Error:", err.response);

      // Agar backend bole task exist hi nahi karta
      if (err.response?.status === 404) {
        removeTask(taskId);
        return;
      }

      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setDeleting(null);
    }
  };

  // Counts per status
  const countByStatus = STATUS_OPTIONS.slice(1).reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s).length;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-foreground/60 text-sm mt-1">
            {tasks.length} tasks across all projects
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      {/* Status Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATUS_OPTIONS.slice(1).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === status
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'bg-card border-border hover:border-primary/30'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {STATUS_ICONS[status]}
              <span className="text-xs font-medium text-foreground/60">{status}</span>
            </div>
            <p className="text-2xl font-bold">{countByStatus[status] || 0}</p>
          </button>
        ))}
      </div>

      {/* Search, Filter, Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-3 bg-card border border-border rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 bg-transparent border-none shadow-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <Filter className="w-4 h-4 text-foreground/40 shrink-0" />
          {PRIORITY_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${priorityFilter === p ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-foreground/5'
                }`}
            >
              {p}
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1 shrink-0" />
          {/* Sort */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-foreground/70 hover:bg-foreground/5"
            >
              <SortAsc className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 py-1 min-w-30"
                >
                  {SORT_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => { setSortBy(s.value); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-foreground/5 transition-colors ${sortBy === s.value ? 'text-primary font-medium' : ''}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-foreground/50 text-sm">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-24 text-center bg-card border border-dashed border-border rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No tasks found</h3>
          <p className="text-foreground/50 text-sm mb-6">Create your first task to get started</p>
          <Button variant="outline" onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Task</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }}
                onClick={() => setDrawerTask(task)}
                className="group flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all"
              >
                {/* Status icon */}
                <div className="shrink-0">{STATUS_ICONS[task.status] || <Circle className="w-4 h-4" />}</div>

                {/* Title + project */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${task.status === 'Completed' ? 'line-through text-foreground/40' : ''}`}>
                    {task.title}
                  </p>
                  {task.project?.title && (
                    <p className="text-xs text-foreground/50 mt-0.5 truncate">{task.project.title}</p>
                  )}
                </div>

                {/* Labels */}
                {task.labels?.length > 0 && (
                  <div className="hidden md:flex gap-1 shrink-0">
                    {task.labels.slice(0, 2).map(label => (
                      <span key={label} className="px-2 py-0.5 bg-foreground/5 rounded-full text-xs text-foreground/60">{label}</span>
                    ))}
                  </div>
                )}

                {/* Priority */}
                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_COLORS[task.priority] || ''}`}>
                  {task.priority}
                </span>

                {/* Due date */}
                {task.dueDate && (
                  <span className={`hidden md:block text-xs font-medium shrink-0 ${new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                    ? 'text-red-500' : 'text-foreground/50'
                    }`}>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}

                {/* Assignee */}
                {task.assignedTo && (
                  <Avatar src={task.assignedTo.avatar} size="sm" title={task.assignedTo.name} className="shrink-0" />
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={e => openEdit(task, e)}
                    className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => handleDelete(task._id, e)}
                    className="p-1.5 text-foreground/50 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                  >
                    {deleting === task._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Detail Drawer */}
      <TaskDrawer
        isOpen={!!drawerTask}
        onClose={() => setDrawerTask(null)}
        task={drawerTask}
        onUpdate={updateTaskInState}
      />

      {/* Create/Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedTask}
        title={modalMode === 'create' ? 'Create New Task' : 'Edit Task'}
      />
    </DashboardLayout>
  );
}