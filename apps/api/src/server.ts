import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { AppDataSource } from './database/dataSource';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './lib/logger';

// Carrega variáveis de ambiente antes de qualquer outra inicialização.
config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// Em desenvolvimento, aceita requisições apenas do servidor de desenvolvimento do frontend.
// Em produção, CORS deve ser configurado via variável de ambiente CORS_ORIGIN.
const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN ?? false)
    : 'http://localhost:5173';

// Middlewares de segurança: helmet adiciona headers HTTP defensivos.
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

// Rate limiting: máximo de 100 requisições por IP a cada 15 minutos.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Todas as rotas da API sob o prefixo /api.
app.use('/api', router);

// Middleware global de erros — deve ser registrado por último.
app.use(errorHandler);

// Inicializa a conexão com o banco e só então inicia o servidor HTTP.
// Isso garante que os repositórios TypeORM estejam prontos antes de qualquer requisição.
AppDataSource.initialize()
  .then(() => {
    logger.info('Conexão com o banco de dados estabelecida');
    app.listen(PORT, () => {
      logger.info({ port: PORT }, `Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    logger.error({ err: error }, 'Falha ao conectar ao banco de dados');
    process.exit(1);
  });

export default app;
