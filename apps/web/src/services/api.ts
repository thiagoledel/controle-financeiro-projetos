import axios from 'axios';

// Tipo genérico para todas as respostas de sucesso da API.
// A API retorna sempre { data: T, message: string } nos endpoints bem-sucedidos.
export interface ApiResponse<T> {
  data: T;
  message: string;
}

// Instância Axios centralizada. O baseURL aponta para /api,
// que em desenvolvimento é proxiado pelo Vite para http://localhost:3001.
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de resposta: transforma erros HTTP em mensagens legíveis.
// As mensagens mapeiam os status codes mais comuns retornados pela API.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status;
    // A API retorna { error: { message, statusCode } } em erros operacionais.
    const apiMessage: string | undefined = error.response?.data?.error?.message;

    let message: string;
    if (status === 404) {
      message = apiMessage ?? 'Registro não encontrado';
    } else if (status === 409) {
      message = apiMessage ?? 'Conflito: registro já existe ou possui vínculos';
    } else if (status === 400) {
      message = apiMessage ?? 'Dados de entrada inválidos';
    } else if (status === 500) {
      message = 'Erro interno do servidor';
    } else if (!error.response) {
      // Erro de rede: servidor inacessível ou timeout.
      message = 'Servidor inacessível. Verifique sua conexão.';
    } else {
      message = apiMessage ?? 'Ocorreu um erro inesperado';
    }

    // Encapsula como Error para que hooks possam ler error.message nos callbacks.
    return Promise.reject(new Error(message));
  },
);
