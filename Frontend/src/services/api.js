import axios from 'axios';

const api = axios.create({
  baseURL: 'http://100.25.219.116:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
