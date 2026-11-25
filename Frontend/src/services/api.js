import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.205.111.124:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
