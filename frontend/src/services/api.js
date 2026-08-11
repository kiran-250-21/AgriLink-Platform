import axios from 'axios';

// Dynamic API Base URL for local development and Render deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrilink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('agrilink_token');
      localStorage.removeItem('agrilink_user');
    }
    return Promise.reject(error);
  }
);

export default API;
