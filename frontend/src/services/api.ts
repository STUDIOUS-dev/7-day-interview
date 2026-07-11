import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  // In production (Vercel build), VITE_API_URL points to the Render backend.
  // In development, the Vite proxy forwards /api/v1 → localhost:8000.
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
