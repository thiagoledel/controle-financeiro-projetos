import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { ProjetoController } from '../controllers/ProjetoController';
import { AtualizacaoMensalController } from '../controllers/AtualizacaoMensalController';
import { EntradaFinanceiraController } from '../controllers/EntradaFinanceiraController';
import { validateRequest } from '../middlewares/validateRequest';
import { createClienteSchema, updateClienteSchema } from '../schemas/cliente.schema';
import { createProjetoSchema, updateProjetoSchema } from '../schemas/projeto.schema';
import {
  createAtualizacaoMensalSchema,
  updateAtualizacaoMensalSchema,
} from '../schemas/atualizacaoMensal.schema';
import {
  createEntradaFinanceiraSchema,
  updateEntradaFinanceiraSchema,
} from '../schemas/entradaFinanceira.schema';

// Registro central de todas as rotas da API.
// Instâncias dos controllers são criadas aqui para reutilização.
const router = Router();

const clienteController = new ClienteController();
const projetoController = new ProjetoController();
const atualizacaoMensalController = new AtualizacaoMensalController();
const entradaFinanceiraController = new EntradaFinanceiraController();

// Rotas de clientes.
router.get('/clientes', clienteController.index.bind(clienteController));
router.get('/clientes/:id', clienteController.show.bind(clienteController));
router.post('/clientes', validateRequest(createClienteSchema), clienteController.create.bind(clienteController));
router.patch('/clientes/:id', validateRequest(updateClienteSchema), clienteController.update.bind(clienteController));
router.delete('/clientes/:id', clienteController.destroy.bind(clienteController));

// Rotas de projetos.
router.get('/projetos', projetoController.index.bind(projetoController));
router.get('/projetos/:id', projetoController.show.bind(projetoController));
router.post('/projetos', validateRequest(createProjetoSchema), projetoController.create.bind(projetoController));
router.patch('/projetos/:id', validateRequest(updateProjetoSchema), projetoController.update.bind(projetoController));
router.delete('/projetos/:id', projetoController.destroy.bind(projetoController));

// Rotas de atualizações mensais.
router.get('/atualizacoes-mensais', atualizacaoMensalController.index.bind(atualizacaoMensalController));
router.get('/atualizacoes-mensais/:id', atualizacaoMensalController.show.bind(atualizacaoMensalController));
router.post('/atualizacoes-mensais', validateRequest(createAtualizacaoMensalSchema), atualizacaoMensalController.create.bind(atualizacaoMensalController));
router.patch('/atualizacoes-mensais/:id', validateRequest(updateAtualizacaoMensalSchema), atualizacaoMensalController.update.bind(atualizacaoMensalController));
router.delete('/atualizacoes-mensais/:id', atualizacaoMensalController.destroy.bind(atualizacaoMensalController));

// Rotas de entradas financeiras.
router.get('/entradas-financeiras', entradaFinanceiraController.index.bind(entradaFinanceiraController));
router.get('/entradas-financeiras/:id', entradaFinanceiraController.show.bind(entradaFinanceiraController));
router.post('/entradas-financeiras', validateRequest(createEntradaFinanceiraSchema), entradaFinanceiraController.create.bind(entradaFinanceiraController));
router.patch('/entradas-financeiras/:id', validateRequest(updateEntradaFinanceiraSchema), entradaFinanceiraController.update.bind(entradaFinanceiraController));
router.delete('/entradas-financeiras/:id', entradaFinanceiraController.destroy.bind(entradaFinanceiraController));

export default router;
