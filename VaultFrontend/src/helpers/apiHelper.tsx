// utils/api.ts
import axios from "axios";

// Set baseURL depending on environment
const api = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "production"
      ? "http://165.22.215.73:81"  // Production server
      : "http://localhost:5000",   // Local dev server
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
