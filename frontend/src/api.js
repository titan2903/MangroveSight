import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.detail || error.message);
    return Promise.reject(error);
  },
);

export const fetchMangroveGeoJSON = async (year, simplify = false) => {
  const response = await api.get(
    `/mangrove/?year=${year}&simplify=${simplify}`,
  );
  return response.data;
};

export const fetchMangroveComparison = async (
  year1,
  year2,
  simplify = false,
) => {
  const response = await api.get(
    `/mangrove/compare/?year1=${year1}&year2=${year2}&simplify=${simplify}`,
  );
  return response.data;
};

export const fetchMangroveHeatmap = async (year) => {
  const response = await api.get(`/mangrove/heatmap/?year=${year}`);
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get("/stats/");
  return response.data;
};

export const fetchAvailableYears = async () => {
  const response = await api.get("/stats/years");
  return response.data;
};

export const askAI = async (question) => {
  const response = await api.post("/ask/", { question });
  return response.data;
};

export default api;
