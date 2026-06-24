"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { projects, tasks } from '@/data/mockData';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '@/components/TaskCard';
import Button from '@/components/ui/Button';
import { Plus, Settings2, Users } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import CommentBox from '@/components/CommentBox';
import { users } from '@/data/mockData';

const initialColumns = ['To Do', 'In Progress', 'Review', 'Completed'];

export default function ProjectBoardPage({ params }) {
  // Mock unwrapping params or fetching project data
  const projectId = 'p1'; // Hardcoded for demo if not using real router
  const project = projects.find(p => p.id === projectId) || projects[0];
  
  const [columns, setColumns] = useState(initialColumns);
  const [boardTasks, setBoardTasks] = useState(tasks.filter(t => t.projectId === project.id));
  
  const [selectedTask, setSelectedTask] = useState(null);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskIndex = boardTasks.findIndex(t => t.id === draggableId);
    const newTasks = [...boardTasks];
    newTasks[taskIndex].status = destination.droppableId;
    
    setBoardTasks(newTasks);
  };

  const projectMembers = project.members.map(id => users.find(u => u.id === id)).filter(Boolean);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {project.name}
            <Badge variant="primary" className="ml-3">{project.status}</Badge>
          </h1>
          <p className="text-foreground/60 text-sm mt-1">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {projectMembers.map((member, i) => (
              <Avatar key={member.id} src={member.avatar} size="sm" className={`border-2 border-background relative z-[${10-i}]`} />
            ))}
          </div>
          <Button variant="outline" size="sm"><Users className="w-4 h-4 mr-2" /> Share</Button>
          <Button variant="outline" size="sm"><Settings2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 items-start h-full min-h-150">
            {columns.map(column => {
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
                        className={`flex-1 p-3 overflow-y-auto space-y-3 min-h-37.5 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
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

      {/* Task Details Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.title || 'Task Details'}>
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <p className="text-sm text-foreground/50 mb-1">Status</p>
                <Badge>{selectedTask.status}</Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground/50 mb-1">Priority</p>
                <Badge variant={selectedTask.priority === 'High' ? 'danger' : selectedTask.priority === 'Medium' ? 'warning' : 'default'}>{selectedTask.priority}</Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground/50 mb-1">Due Date</p>
                <p className="text-sm font-medium">{selectedTask.dueDate}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-foreground/80 leading-relaxed bg-foreground/5 p-4 rounded-xl">
                {selectedTask.description || 'No description provided.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Activity & Comments</h3>
              <CommentBox comments={[]} />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
