"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("flowsyncUser");
      const storedToken = localStorage.getItem("flowsyncToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem("flowsyncUser");
      localStorage.removeItem("flowsyncToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthData = useCallback((data) => {
    localStorage.setItem("flowsyncUser", JSON.stringify(data));
    localStorage.setItem("flowsyncToken", data.token);

    setUser(data);
    setToken(data.token);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await API.post("/auth/login", { email, password });
      const { data } = res.data;

      saveAuthData(data);

      return data;
    },
    [saveAuthData]
  );

  const signup = useCallback(
    async (name, email, password, role) => {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      const { data } = res.data;

      saveAuthData(data);

      return data;
    },
    [saveAuthData]
  );

  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem("flowsyncUser");
      localStorage.removeItem("flowsyncToken");

      setUser(null);
      setToken(null);

      router.push("/login");
    }
  }, [router]);

  const updateUser = useCallback(
    (updatedData) => {
      const merged = { ...user, ...updatedData };

      localStorage.setItem("flowsyncUser", JSON.stringify(merged));
      setUser(merged);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
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