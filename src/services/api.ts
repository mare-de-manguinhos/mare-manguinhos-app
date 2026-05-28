import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

console.log("[API] baseURL:", process.env.EXPO_PUBLIC_API_URL);

api.interceptors.request.use((config) => {
  console.log("[API] Requisição:", config.method?.toUpperCase(), config.baseURL, config.url);
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro?.response?.status === 401) {
      console.warn('[API] 401 recebido - fazendo logout automático. URL:', erro.config?.url);
      useAuthStore.getState().logout();
    }
    return Promise.reject(erro);
  },
);

export default api;
