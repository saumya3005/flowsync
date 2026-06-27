const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Make io accessible in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FlowSync API is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/meetings', meetingRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Socket.io real-time events
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a project room
  socket.on('joinProject', (projectId) => {
    socket.join(`project:${projectId}`);
    console.log(`Socket ${socket.id} joined project:${projectId}`);
  });

  // Leave a project room
  socket.on('leaveProject', (projectId) => {
    socket.leave(`project:${projectId}`);
  });

  // Join a user notification room
  socket.on('joinUser', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined user:${userId}`);
  });

  // User online
  socket.on('userOnline', (userId) => {
    io.emit('userOnline', { userId });
  });

  // User offline
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    io.emit('userOffline', { socketId: socket.id });
  });

  // Project events
  socket.on('projectCreated', (data) => {
    socket.broadcast.emit('projectCreated', data);
  });

  socket.on('projectUpdated', (data) => {
    io.to(`project:${data.projectId}`).emit('projectUpdated', data);
  });

  // Task events
  socket.on('taskCreated', (data) => {
    io.to(`project:${data.projectId}`).emit('taskCreated', data);
  });

  socket.on('taskUpdated', (data) => {
    io.to(`project:${data.projectId}`).emit('taskUpdated', data);
  });

  socket.on('taskStatusChanged', (data) => {
    io.to(`project:${data.projectId}`).emit('taskStatusChanged', data);
  });

  // Comment events
  socket.on('commentAdded', (data) => {
    io.to(`project:${data.projectId}`).emit('commentAdded', data);
  });

  // Notification events
  socket.on('notificationCreated', (data) => {
    io.to(`user:${data.userId}`).emit('notificationCreated', data);
  });

  // ====== WebRTC Meeting Signaling ======
  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    // Notify other users in the room
    socket.to(roomId).emit('user-joined', { userId, userName, socketId: socket.id });
    console.log(`User ${userName} joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer, to }) => {
    socket.to(to).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ answer, to }) => {
    socket.to(to).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('leave-room', ({ roomId }) => {
    socket.to(roomId).emit('user-left', { socketId: socket.id });
    socket.leave(roomId);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
