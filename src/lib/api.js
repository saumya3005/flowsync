import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT from localStorage if available (fallback for non-cookie flows)
API.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ────────────────────────────────────────────────────────────────

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// ─── User APIs ────────────────────────────────────────────────────────────────

export const getUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);

// ─── Project APIs ─────────────────────────────────────────────────────────────

export const createProject = (data) => API.post('/projects', data);
export const getProjects = () => API.get('/projects');
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const addProjectMember = (id, userId) => API.post(`/projects/${id}/members`, { userId });

// ─── Task APIs ────────────────────────────────────────────────────────────────

export const createTask = (data) => API.post('/tasks', data);
export const getTasks = () => API.get('/tasks');
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => API.patch(`/tasks/${id}/status`, { status });

// ─── Comment APIs ─────────────────────────────────────────────────────────────

export const addComment = (taskId, text) => API.post(`/comments/${taskId}`, { text });
export const getCommentsByTask = (taskId) => API.get(`/comments/${taskId}`);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// ─── Notification APIs ────────────────────────────────────────────────────────

export const getNotifications = () => API.get('/notifications');
export const markNotificationAsRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => API.patch('/notifications/read-all');

export default API;
