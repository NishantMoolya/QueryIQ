import { getAuthToken } from '@/utils/localStorageUtils';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      switch (error.response.status) {
        case 400:
          // Handle Bad Request
          break;
        case 401:
          // Handle Unauthorized (e.g., redirect to login)
          break;
        case 403:
          // Handle Forbidden
          break;
        case 404:
          // Handle Not Found
          break;
        case 500:
          // Handle Internal Server Error
          break;
        default:
          // Handle other status codes
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // Handle network errors or server not reachable
    } else {
      // Something happened in setting up the request
      // Handle unexpected errors
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
