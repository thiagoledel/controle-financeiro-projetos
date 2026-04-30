import { Router } from 'express';
import { AppDataSource } from '../database/dataSource';

import { Cliente } from '../entities/Cliente';
import { Projeto } from '../entities/Projeto';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';

import { ClienteService } from '../services/ClienteService';
import { ProjetoService } from '../services/ProjetoService';
import { AtualizacaoMensalService } from '../services/AtualizacaoMensalService';
import { EntradaFinanceiraService } from '../services/EntradaFinanceiraService';

import { ClienteController } from '../controllers/ClienteController';
import { ProjetoController } from '../controllers/ProjetoController';
import { AtualizacaoMensalController } from '../controllers/AtualizacaoMensalController';
import { EntradaFinanceiraController } from '../controllers/EntradaFinanceiraController';

import { validateRequest } from '../middlewares/validateRequest';
import { createClienteSchema, updateClienteSchema } from '../schemas/cliente.schema';
import { createProjetoSchema, updateProjetoSchema } from '../schemas/projeto.schema';
import { createAtualizacaoMensalSchema } from '../schemas/atualizacaoMensal.schema';
import {
  createEntradaFinanceiraSchema,
  updateEntradaFinanceiraSchema,
} from '../schemas/entradaFinanceira.schema';

// Registro central de todas as rotas da API.
// Os serviços recebem os repositórios TypeORM via construtor (inversão de dependência).
// AppDataSource.getRepository() retorna uma instância lazy — o DataSource precisa estar
// inicializado antes de qualquer requisição, o que é garantido em server.ts.
const router = Router();

// Instanciação dos repositórios TypeORM.
const clienteRepo = AppDataSource.getRepository(Cliente);
const projetoRepo = AppDataSource.getRepository(Projeto);
const atualizacaoRepo = AppDataSource.getRepository(AtualizacaoMensal);
const entradaRepo = AppDataSource.getRepository(EntradaFinanceira);

// Instanciação dos serviços com injeção de repositórios.
const clienteService = new ClienteService(clienteRepo);
const projetoService = new ProjetoService(projetoRepo, clienteRepo);
const atualizacaoService = new AtualizacaoMensalService(atualizacaoRepo, projetoRepo);
const entradaService = new EntradaFinanceiraService(entradaRepo, atualizacaoRepo);

// Instanciação dos controllers com injeção de serviços.
const clienteCtrl = new ClienteController(clienteService);
const projetoCtrl = new ProjetoController(projetoService);
const atualizacaoCtrl = new AtualizacaoMensalController(atualizacaoService);
const entradaCtrl = new EntradaFinanceiraController(entradaService);

// ── Clientes ──────────────────────────────────────────────────────────────────
// GET    /api/clientes          → lista todos (inclui projetos vinculados)
// GET    /api/clientes/:id      → busca por ID (inclui projetos)
// POST   /api/clientes          → cria cliente
// PUT    /api/clientes/:id      → atualiza cliente
// DELETE /api/clientes/:id      → remove (409 se tiver projetos)
router.get('/clientes', clienteCtrl.index.bind(clienteCtrl));
router.get('/clientes/:id', clienteCtrl.show.bind(clienteCtrl));
router.post('/clientes', validateRequest(createClienteSchema), clienteCtrl.create.bind(clienteCtrl));
router.put('/clientes/:id', validateRequest(updateClienteSchema), clienteCtrl.update.bind(clienteCtrl));
router.delete('/clientes/:id', clienteCtrl.destroy.bind(clienteCtrl));

// ── Projetos ──────────────────────────────────────────────────────────────────
// GET    /api/projetos          → lista todos (inclui cliente)
// GET    /api/projetos/:id      → busca por ID (inclui cliente + atualizações + entradas)
// POST   /api/projetos          → cria projeto
// PUT    /api/projetos/:id      → atualiza projeto
// DELETE /api/projetos/:id      → remove projeto
router.get('/projetos', projetoCtrl.index.bind(projetoCtrl));
router.get('/projetos/:id', projetoCtrl.show.bind(projetoCtrl));
router.post('/projetos', validateRequest(createProjetoSchema), projetoCtrl.create.bind(projetoCtrl));
router.put('/projetos/:id', validateRequest(updateProjetoSchema), projetoCtrl.update.bind(projetoCtrl));
router.delete('/projetos/:id', projetoCtrl.destroy.bind(projetoCtrl));

// ── Atualizações Mensais (aninhadas em /projetos/:projetoId) ──────────────────
// GET    /api/projetos/:projetoId/atualizacoes        → lista do projeto
// GET    /api/projetos/:projetoId/atualizacoes/:id    → busca por ID (inclui entradas)
// POST   /api/projetos/:projetoId/atualizacoes        → cria { month, year }
// DELETE /api/projetos/:projetoId/atualizacoes/:id    → remove + cascade entradas
router.get('/projetos/:projetoId/atualizacoes', atualizacaoCtrl.index.bind(atualizacaoCtrl));
router.get('/projetos/:projetoId/atualizacoes/:id', atualizacaoCtrl.show.bind(atualizacaoCtrl));
router.post(
  '/projetos/:projetoId/atualizacoes',
  validateRequest(createAtualizacaoMensalSchema),
  atualizacaoCtrl.create.bind(atualizacaoCtrl),
);
router.delete('/projetos/:projetoId/atualizacoes/:id', atualizacaoCtrl.destroy.bind(atualizacaoCtrl));

// ── Entradas Financeiras (aninhadas em /atualizacoes/:atualizacaoId) ──────────
// GET    /api/atualizacoes/:atualizacaoId/entradas         → lista da atualização
// POST   /api/atualizacoes/:atualizacaoId/entradas         → cria { revenue, margin, description }
// PUT    /api/atualizacoes/:atualizacaoId/entradas/:id     → atualiza entrada
// DELETE /api/atualizacoes/:atualizacaoId/entradas/:id     → remove entrada
router.get('/atualizacoes/:atualizacaoId/entradas', entradaCtrl.index.bind(entradaCtrl));
router.post(
  '/atualizacoes/:atualizacaoId/entradas',
  validateRequest(createEntradaFinanceiraSchema),
  entradaCtrl.create.bind(entradaCtrl),
);
router.put(
  '/atualizacoes/:atualizacaoId/entradas/:id',
  validateRequest(updateEntradaFinanceiraSchema),
  entradaCtrl.update.bind(entradaCtrl),
);
router.delete('/atualizacoes/:atualizacaoId/entradas/:id', entradaCtrl.destroy.bind(entradaCtrl));

export default router;
