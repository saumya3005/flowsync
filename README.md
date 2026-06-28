# ⚡ FlowSync — Collaborative Project Management Platform

FlowSync is a full-stack collaborative project management web application built for teams to manage projects, tasks, members, meetings, comments, and notifications in one modern workspace.

## 🚀 Live Demo

Frontend: https://flowsync-peach-five.vercel.app  
Backend: https://flowsync-lc3f.onrender.com/api/health

## ✨ Features

- User authentication with JWT
- Login and signup system
- Protected dashboard routes
- Dynamic user profile
- Project creation, editing, and deletion
- Task creation, editing, assignment, and deletion
- Task priority, status, due date, and labels
- Project-based task management
- Team member management structure
- Real-time updates using Socket.io
- Meeting room structure with WebRTC signaling
- Notification system structure
- Profile settings
- Responsive dashboard layout
- Clean SaaS-style UI with animations

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io
- Cookie Parser
- Bcrypt.js

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📁 Project Structure

```bash
flowsync/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── meetings/
│   │   ├── team/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── login/
│   │   └── signup/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── package.json
└── README.md