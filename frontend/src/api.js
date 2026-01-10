import axios from 'axios';
import { getToken, removeToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const patientAPI = {
  predictOPD: (data) => api.post('/api/predict-opd', data),
};

export const doctorAPI = {
  getAnalytics: () => api.get('/api/doctor/analytics'),
};

export const adminAPI = {
  getAnalytics: () => api.get('/api/admin/analytics'),
};

export default api;
