import axios from 'axios';

const api = axios.create({
  baseURL: 'http://100.31.160.91:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
