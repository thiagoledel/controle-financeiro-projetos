import pino from 'pino';

// Logger centralizado da aplicação usando pino para alto desempenho e saída estruturada.
// Em ambiente de testes, o nível "silent" suprime toda saída para manter o output limpo.
export const logger = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : (process.env.LOG_LEVEL ?? 'info'),
});
