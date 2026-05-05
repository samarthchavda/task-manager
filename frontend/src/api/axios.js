import axios from 'axios';

// Prefer build-time VITE_API_URL. If not provided at build time, fall back to a
// runtime-derived value (current origin + /api). This avoids baking a
// hardcoded localhost URL into production bundles when the env var is missing.
const API_URL = import.meta.env.VITE_API_URL ?? (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
