"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { TaskProvider } from "@/context/TaskContext";
import { SocketProvider } from "@/context/SocketContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ProjectProvider>
          <TaskProvider>{children}</TaskProvider>
        </ProjectProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
