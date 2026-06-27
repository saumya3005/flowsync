"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Plus, Filter, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import ProjectModal from '@/components/modals/ProjectModal';
import api from '@/lib/api';

export default function ProjectsPage() {
  const { projects, loading, addProject, updateProjectInState, removeProject } = useProjects();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedProject, setSelectedProject] = useState(null);

  // Derive filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = (p.title || p.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filterOptions = ['All', 'Active', 'Completed', 'Pending'];

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      try {
        const res = await api.delete(`/projects/${projectId}`);
        if (res.data.success) {
          removeProject(projectId);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        const res = await api.post('/projects', formData);
        if (res.data.success) {
          addProject(res.data.data);
        }
      } else {
        const res = await api.put(`/projects/${selectedProject._id}`, formData);
        if (res.data.success) {
          updateProjectInState(res.data.data);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage and track your team's projects.</p>
        </div>
        <Button onClick={openCreateModal}><Plus className="w-4 h-4 mr-2" /> New Project</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card border border-border p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input 
            placeholder="Search projects..." 
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
          <p className="text-foreground/50 text-sm">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, idx) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              index={idx} 
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card border border-border border-dashed rounded-2xl">
              <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-foreground/30" />
              </div>
              <h3 className="text-lg font-medium mb-1">No projects found</h3>
              <p className="text-foreground/50 text-sm mb-6">Try adjusting your search or create a new one.</p>
              <Button variant="outline" onClick={openCreateModal}>Create Project</Button>
            </div>
          )}
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedProject}
        title={modalMode === 'create' ? 'Create New Project' : 'Edit Project'}
      />
    </DashboardLayout>
  );
}
