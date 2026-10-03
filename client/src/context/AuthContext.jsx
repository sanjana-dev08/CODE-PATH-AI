import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import api from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("codepath-token") || localStorage.getItem("token")));

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("codepath-token") || localStorage.getItem("token");
    const onUnauthorized = () => {
      localStorage.removeItem("codepath-token");
      localStorage.removeItem("token");
      setUser(null);
    };
    window.addEventListener("codepath:unauthorized", onUnauthorized);
    if (token) {
      localStorage.setItem("codepath-token", token);
      api.get("/auth/me")
        .then(({ data }) => { if (active) setUser(data.data.user); })
        .catch(() => { if (active) onUnauthorized(); })
        .finally(() => { if (active) setLoading(false); });
    }
    return () => {
      active = false;
      window.removeEventListener("codepath:unauthorized", onUnauthorized);
    };
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("codepath-token", data.token);
    localStorage.removeItem("token");
    setUser(data.user);
    return data.user;
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return saveSession(data.data);
  };

  const register = async (details) => {
    const { data } = await api.post("/auth/register", details);
    return saveSession(data.data);
  };

  const logout = () => {
    localStorage.removeItem("codepath-token");
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}