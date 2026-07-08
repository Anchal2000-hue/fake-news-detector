import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("truthlens_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data);
    return data;
  }

  async function signup(name, email, password) {
    const { data } = await api.post("/auth/signup", { name, email, password });
    persist(data);
    return data;
  }

  function persist(data) {
    localStorage.setItem("truthlens_token", data.token);
    localStorage.setItem("truthlens_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("truthlens_token");
    localStorage.removeItem("truthlens_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
