import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Cliente } from '../entities/Cliente';
import { Projeto } from '../entities/Projeto';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';

// Carrega variáveis de ambiente — necessário quando o dataSource é usado via CLI do TypeORM.
config();

// DataSource principal do TypeORM.
// synchronize: false — toda mudança de schema deve ser feita via migrations para garantir rastreabilidade.
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Cliente, Projeto, AtualizacaoMensal, EntradaFinanceira],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});
