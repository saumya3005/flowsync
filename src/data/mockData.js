export const currentUser = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@flowsync.com',
  role: 'Product Manager',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
};

export const users = [
  currentUser,
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@flowsync.com', role: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'online' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@flowsync.com', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', status: 'offline' },
  { id: 'u4', name: 'Emily Davis', email: 'emily@flowsync.com', role: 'UX Designer', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', status: 'online' },
];

export const projects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhaul of the main corporate website with new branding.',
    status: 'Active',
    progress: 65,
    dueDate: '2026-07-15',
    members: ['u1', 'u2', 'u4'],
    taskCount: 24,
  },
  {
    id: 'p2',
    name: 'Mobile App V2',
    description: 'Adding new features and improving performance for the iOS/Android app.',
    status: 'Pending',
    progress: 10,
    dueDate: '2026-08-01',
    members: ['u1', 'u3'],
    taskCount: 12,
  },
  {
    id: 'p3',
    name: 'Marketing Campaign Q3',
    description: 'Assets and strategy for the Q3 product launch.',
    status: 'Completed',
    progress: 100,
    dueDate: '2026-06-01',
    members: ['u1', 'u4'],
    taskCount: 8,
  },
];

export const tasks = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Design System Update',
    description: 'Update the core design system components in Figma to match new brand guidelines.',
    status: 'In Progress', // To Do, In Progress, Review, Completed
    priority: 'High',
    assigneeId: 'u4',
    dueDate: '2026-06-25',
    comments: 3,
    attachments: 2,
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Implement Navigation Bar',
    description: 'Build the new responsive top navigation bar using React and Tailwind.',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'u2',
    dueDate: '2026-06-28',
    comments: 0,
    attachments: 1,
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Setup Database Schema',
    description: 'Configure initial PostgreSQL schema and Prisma models.',
    status: 'Review',
    priority: 'High',
    assigneeId: 'u3',
    dueDate: '2026-06-20',
    comments: 5,
    attachments: 0,
  },
  {
    id: 't4',
    projectId: 'p1',
    title: 'Hero Section Copy',
    description: 'Write engaging copy for the main landing page hero section.',
    status: 'Completed',
    priority: 'Low',
    assigneeId: 'u1',
    dueDate: '2026-06-15',
    comments: 1,
    attachments: 0,
  },
];

export const notifications = [
  {
    id: 'n1',
    type: 'mention',
    message: 'Sarah mentioned you in "Implement Navigation Bar"',
    time: '10 mins ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'assignment',
    message: 'You were assigned to "Hero Section Copy"',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 'n3',
    type: 'system',
    message: 'Project "Mobile App V2" was created',
    time: '1 day ago',
    read: true,
  },
];
