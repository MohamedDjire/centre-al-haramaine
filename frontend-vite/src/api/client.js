import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost/Centre_Al_Haramaine/backend/api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
