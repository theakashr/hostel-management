import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hostelhub-backend-ashen.vercel.app/api', // Vercel backend URL
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
