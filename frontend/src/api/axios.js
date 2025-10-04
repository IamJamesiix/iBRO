import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ibro.onrender.com/ibro',
  // 'http://localhost:4080/ibro' 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;