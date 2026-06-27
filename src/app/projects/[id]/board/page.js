"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '@/components/TaskCard';
import Button from '@/components/ui/Button';
import { Plus, Settings2, Users, Loader2, Video } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import TaskDrawer from '@/components/modals/TaskDrawer';
import { useProjects } from '@/context/ProjectContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const initialColumns = ['To Do', 'In Progress', 'Review', 'Completed'];

export default function ProjectBoardPage() {
  const { id: projectId } = useParams();
  const { projects, loading: projectsLoading } = useProjects();
  const router = useRouter();
  
  const [boardTasks, setBoardTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // Find current project
  const project = projects.find(p => p._id === projectId);

  // Fetch project tasks
  useEffect(() => {
    if (!projectId) return;
    
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const res = await api.get(`/tasks/project/${projectId}`);
        if (res.data.success) {
          setBoardTasks(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch project tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI update
    const taskIndex = boardTasks.findIndex(t => t._id === draggableId);
    if (taskIndex === -1) return;

    const newStatus = destination.droppableId;
    
    // Copy array and update local status
    const newTasks = [...boardTasks];
    const updatedTask = { ...newTasks[taskIndex], status: newStatus };
    newTasks[taskIndex] = updatedTask;
    setBoardTasks(newTasks);

    // Persist to backend
    try {
      await api.patch(`/tasks/${draggableId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status on server", err);
      // Revert on failure (simplified - normally you'd refetch or store previous state)
    }
  };

  if (projectsLoading || loadingTasks) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col h-[80vh] items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-2">Project not found</h2>
          <p className="text-foreground/50">This project may have been deleted or you don't have access.</p>
        </div>
      </DashboardLayout>
    );
  }

  const projectMembers = Array.isArray(project.members) ? project.members : [];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {project.name}
            <Badge variant="primary" className="ml-3">{project.status || 'Active'}</Badge>
          </h1>
          <p className="text-foreground/60 text-sm mt-1">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {projectMembers.map((member, i) => (
              <Avatar key={member._id} src={member.avatar} size="sm" className={`border-2 border-background relative z-[${10-i}]`} title={member.name} />
            ))}
          </div>
          <button
            onClick={async () => {
              try {
                const res = await api.post('/meetings', { title: `${project.name} Meeting`, projectId });
                if (res.data.success) router.push(`/meetings/${res.data.data.roomId}`);
              } catch(e) {}
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-xl hover:bg-primary/20 transition-colors"
          >
            <Video className="w-4 h-4" /> Start Meeting
          </button>
          <Button variant="outline" size="sm"><Users className="w-4 h-4 mr-2" /> Share</Button>
          <Button variant="outline" size="sm"><Settings2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 items-start h-full min-h-150">
            {initialColumns.map(column => {
              const columnTasks = boardTasks.filter(t => t.status === column);
              return (
                <div key={column} className="w-80 shrink-0 bg-foreground/5 rounded-2xl flex flex-col max-h-full">
                  <div className="p-4 flex items-center justify-between border-b border-border/50">
                    <h3 className="font-semibold">{column} <span className="text-foreground/50 ml-2 text-sm">{columnTasks.length}</span></h3>
                    <button className="text-foreground/40 hover:text-foreground p-1"><Plus className="w-4 h-4" /></button>
                  </div>
                  
                  <Droppable droppableId={column}>
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className={`flex-1 p-3 overflow-y-auto space-y-3 min-h-37.5 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-xl' : ''}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <TaskCard task={task} onClick={() => setSelectedTask(task)} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div className="p-3 border-t border-border/50">
                    <button className="w-full py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" /> Add Task
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Add Column Button */}
            <div className="w-80 shrink-0">
              <button className="w-full h-14 border-2 border-dashed border-border hover:border-primary/50 text-foreground/50 hover:text-primary rounded-2xl transition-colors flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" /> Add Column
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>

      <TaskDrawer 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </DashboardLayout>
  );
}
