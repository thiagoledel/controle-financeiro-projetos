import axios from 'axios';
import { toast } from 'sonner';

// Instância Axios centralizada. O baseURL aponta para /api,
// que em dev é proxiado pelo Vite e em prod pelo nginx.
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de resposta: exibe toast de erro automático para falhas HTTP.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string = error.response?.data?.message ?? 'Ocorreu um erro inesperado';
    toast.error(message);
    return Promise.reject(error);
  },
);
