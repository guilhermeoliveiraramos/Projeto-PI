import axios from 'axios';

const api = axios.create({
  baseURL: 'http://100.53.185.38:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
