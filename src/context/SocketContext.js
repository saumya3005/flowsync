"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      // Connect to Socket.io server
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
      const newSocket = io(socketUrl, {
        auth: {
          token: user.token
        }
      });
      
      setSocket(newSocket);
      
      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
