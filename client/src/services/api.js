import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("codepath-token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("codepath-token");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("codepath:unauthorized"));
  }
  return Promise.reject(error);
});

export const getErrorMessage = (error) => error.response?.data?.message || "Could not connect to CodePath AI. Check that the server is running.";
export default api;