import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  config => {
    const token = process.env.ACCESS_TOKEN;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  response => response.data,
  error => {
    // Handle errors
    console.error('Error response', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;
