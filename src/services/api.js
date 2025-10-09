import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // Important for sending/receiving cookies
});

let isRefreshing = false;

// Global response handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalRequest = err.config;
    
    // Prevent infinite loops
    if (err.response?.status === 401 && !isRefreshing && !originalRequest._retry) {
      isRefreshing = true;
      originalRequest._retry = true;

      // Only redirect if it's not an /auth/me request to prevent loops
      if (!originalRequest.url.includes('/auth/me')) {
        window.location.href = "/login";
      }
    }

    isRefreshing = false;
    return Promise.reject(err);
  }
);

export default api;
