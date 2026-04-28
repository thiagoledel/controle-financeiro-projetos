import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { AppDataSource } from './database/dataSource';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

// Carrega variáveis de ambiente antes de qualquer outra inicialização.
config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares de segurança, parsing e rate limiting.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // janela de 15 minutos
    max: 100,                  // máximo de 100 requisições por janela por IP
  }),
);

// Todas as rotas da API sob o prefixo /api.
app.use('/api', router);

// Middleware global de erros — deve ser registrado por último.
app.use(errorHandler);

// Inicializa a conexão com o banco e só então inicia o servidor HTTP.
AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Falha ao conectar ao banco de dados:', error);
    process.exit(1);
  });

export default app;
