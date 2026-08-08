import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

export const fetchMangroveGeoJSON = async (year) => {
  const response = await api.get(`/mangrove/?year=${year}`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/stats/');
  return response.data;
};

export const fetchAvailableYears = async () => {
  const response = await api.get('/stats/years');
  return response.data;
};

export const askAI = async (question) => {
  const response = await api.post('/ask/', { question });
  return response.data;
};

export default api;
