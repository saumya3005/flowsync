"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("flowsyncUser");
      const storedToken = localStorage.getItem("flowsyncToken");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // If parse fails, clear storage
      localStorage.removeItem("flowsyncUser");
      localStorage.removeItem("flowsyncToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { data } = res.data;
    localStorage.setItem("flowsyncUser", JSON.stringify(data));
    localStorage.setItem("flowsyncToken", data.token);
    setUser(data);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem("flowsyncUser");
      localStorage.removeItem("flowsyncToken");
      setUser(null);
      setToken(null);
      router.push("/login");
    }
  }, [router]);

  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem("flowsyncUser", JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
