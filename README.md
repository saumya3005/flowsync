<div align="center">

# 🚀 FlowSync

### A Modern Project Management & Team Collaboration Platform

<p>
  <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=26&duration=2800&pause=900&color=635BFF&center=true&vCenter=true&width=900&lines=Manage+Projects+Smarter.;Track+Tasks+Faster.;Collaborate+in+Real-Time.;Built+for+Modern+Teams." />
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Backend-Node.js+Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socket.io" />
  <img src="https://img.shields.io/badge/Auth-JWT-FF6B6B?style=for-the-badge" />
</p>

<p>
  <a href="https://flowsync-peach-five.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-Open_App-635BFF?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://flowsync-lc3f.onrender.com/api/health">
    <img src="https://img.shields.io/badge/API-Healthy-00C2A8?style=for-the-badge" />
  </a>
</p>

</div>

---

## ✨ About FlowSync

**FlowSync** is a full-stack SaaS-style project management platform built for teams, developers, students, and project collaborators.

It combines the productivity of **Trello**, the structure of **Asana**, the speed of **Linear**, and collaboration features inspired by **Google Meet**.

With FlowSync, users can manage projects, create tasks, invite members, track progress, collaborate in real time, and organize work inside a modern dashboard.

---

## 🌐 Live Links

| Type | Link |
|---|---|
| 🚀 Frontend | https://flowsync-peach-five.vercel.app |
| ⚙️ Backend Health | https://flowsync-lc3f.onrender.com/api/health |
| 🗄️ Database | MongoDB Atlas |
| ☁️ Frontend Deploy | Vercel |
| ☁️ Backend Deploy | Render |

---

## 🎯 Core Highlights

- 🔐 Secure authentication with JWT
- 📊 Dynamic dashboard with real data
- 📁 Project creation, editing, deletion
- ✅ Task creation, editing, assignment, deletion
- 👥 Team member management
- 📩 Invite member structure
- 🔔 Notification system structure
- 🎥 Meeting room and WebRTC signaling structure
- ⚡ Real-time updates using Socket.io
- 🎨 Premium SaaS-style UI
- 📱 Responsive layout for desktop and mobile
- ☁️ Deployed with Vercel + Render + MongoDB Atlas

---

## 🧩 Feature Overview

<table>
<tr>
<td width="50%">

### 📊 Dashboard
- User-specific dashboard
- Total projects
- Active tasks
- Completed tasks
- Overdue tasks
- Recent projects
- Recent tasks

</td>
<td width="50%">

### 📁 Projects
- Create projects
- Edit projects
- Delete projects
- Project owner
- Project members
- Priority and due dates
- Member roles

</td>
</tr>

<tr>
<td width="50%">

### ✅ Tasks
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks
- Task priority
- Task status
- Labels and deadlines

</td>
<td width="50%">

### 👥 Team
- View team members
- Invite members
- Role-based structure
- User avatars
- Email-based member flow
- Online status structure

</td>
</tr>

<tr>
<td width="50%">

### 🎥 Meetings
- Meeting rooms
- Room ID structure
- Join meeting flow
- Socket.io signaling
- WebRTC-ready architecture
- Mic/camera control structure

</td>
<td width="50%">

### 🔔 Notifications
- User-specific notifications
- Project invite alerts
- Task update alerts
- Real-time notification structure
- Read/unread flow structure

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,js" />
</p>

- Next.js
- React
- Tailwind CSS
- Framer Motion
- Axios
- Context API
- Lucide React

### Backend

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Socket.io
- Cookie Parser
- dotenv

### Deployment

<p>
  <img src="https://skillicons.dev/icons?i=vercel" />
</p>

- Vercel
- Render
- MongoDB Atlas

---

## 🏗️ Architecture

```txt
┌───────────────────────────────┐
│           User Browser         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Next.js Frontend         │
│  Pages • Components • Context  │
└───────────────┬───────────────┘
                │ Axios / Socket.io
                ▼
┌───────────────────────────────┐
│      Express.js Backend        │
│ Routes • Controllers • Models  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         MongoDB Atlas          │
│ Users • Projects • Tasks       │
│ Comments • Meetings • Alerts   │
└───────────────────────────────┘
```

---

## 📂 Folder Structure

```txt
flowsync/
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── team/
│   │   ├── meetings/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── modals/
│   │   └── ui/
│   │
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
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/saumya3005/flowsync.git
cd flowsync
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

For frontend deployment, add these variables in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-render-backend-url.onrender.com
```

---

## ▶️ Run Locally

### Start Backend

```bash
cd server
npm run dev
```

Backend runs on:

```txt
http://localhost:5001
```

### Start Frontend

Open a new terminal:

```bash
cd flowsync
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## 🔗 API Routes

### Authentication

```http
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Users

```http
GET    /api/users
GET    /api/users/:id
PUT    /api/users/profile
PUT    /api/users/avatar
PUT    /api/users/password
PUT    /api/users/preferences
```

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/invite
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status
POST   /api/tasks/:id/checklist
PATCH  /api/tasks/:id/checklist/:itemId
```

### Notifications

```http
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

### Meetings

```http
POST   /api/meetings
GET    /api/meetings
GET    /api/meetings/:roomId
POST   /api/meetings/:roomId/join
```

---

## 🧠 What I Learned

While building FlowSync, I worked on:

- Full-stack MERN-style architecture
- JWT authentication
- Protected frontend routes
- MongoDB data modeling
- REST API design
- Real-time Socket.io events
- Project and task CRUD operations
- Deployment using Vercel and Render
- CORS handling in production
- SaaS dashboard UI/UX design
- Context-based state management


## 🖼️ Screenshots

> Add your screenshots inside a folder like `public/screenshots/` and update the image paths below.

```md
![Dashboard](public/screenshots/dashboard.png)
![Projects](public/screenshots/projects.png)
![Tasks](public/screenshots/tasks.png)
![Team](public/screenshots/team.png)
```

---

## 🚀 Roadmap

- [x] JWT Authentication
- [x] Project CRUD
- [x] Task CRUD
- [x] Deployment
- [x] Dynamic dashboard
- [ ] Advanced Kanban drag-and-drop
- [ ] Full meeting experience
- [ ] Email invitations
- [ ] OTP verification
- [ ] File attachments
- [ ] Advanced analytics
- [ ] Calendar view
- [ ] AI task suggestions
- [ ] Mobile PWA

---

## 🧪 Testing Checklist

- [x] Signup
- [x] Login
- [x] Logout
- [x] Create project
- [x] Edit project
- [x] Delete project
- [x] Create task
- [x] Edit task
- [x] Delete task
- [x] Dashboard loads real data
- [x] Backend deployed
- [x] Frontend deployed
- [ ] Team role management
- [ ] Full meeting testing
- [ ] Advanced notifications

---

## 🚀 Deployment

### Frontend: Vercel

```txt
https://flowsync-peach-five.vercel.app
```

### Backend: Render

```txt
https://flowsync-lc3f.onrender.com
```

### Database: MongoDB Atlas

Used for storing:

- Users
- Projects
- Tasks
- Comments
- Meetings

---

## 👩‍💻 Author

<div align="center">

### Saumya Agrahari

**B.Tech AI & ML Student | Full-Stack Developer | Project Builder**

<p>
  <a href="https://github.com/saumya3005">
    <img src="https://img.shields.io/badge/GitHub-saumya3005-black?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/saumya-agrahari-924900347">
    <img src="https://img.shields.io/badge/LinkedIn-Saumya_Agrahari-blue?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="mailto:saumyaagrahari262730@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>

</div>

---

## 🤝 Contribution

Contributions are welcome.

```bash
git fork
git checkout -b feature-name
git commit -m "Add feature"
git push origin feature-name
```

Then open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

## ⭐ Star this repository if you like FlowSync



</div>