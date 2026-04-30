import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';
import { ClienteController } from '../../controllers/ClienteController';
import { ClienteService } from '../../services/ClienteService';
import { validateRequest } from '../../middlewares/validateRequest';
import { createClienteSchema } from '../../schemas/cliente.schema';
import { errorHandler } from '../../middlewares/errorHandler';
import { AppError } from '../../errors/AppError';

// Monta um app Express mínimo com mock do serviço — sem banco de dados.
// Testa o pipeline: rota → validateRequest → controller → errorHandler.
function buildApp(mockService: Partial<ClienteService>) {
  const app = express();
  app.use(express.json());

  const ctrl = new ClienteController(mockService as ClienteService);
  const router = Router();

  router.get('/clientes', ctrl.index);
  router.post('/clientes', validateRequest(createClienteSchema), ctrl.create);

  app.use('/api', router);
  app.use(errorHandler);
  return app;
}

// Mock compartilhado por todos os testes — resetado a cada it pelo beforeEach.
const mockService: jest.Mocked<Pick<ClienteService, 'findAll' | 'findById' | 'create' | 'update' | 'delete'>> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

const app = buildApp(mockService as unknown as ClienteService);

// ── POST /api/clientes ────────────────────────────────────────────────────────

describe('POST /api/clientes', () => {
  it('deve criar um cliente e retornar 201 com { data, message }', async () => {
    // Cenário: payload válido → service cria cliente → retorna 201.
    const created = { id: 1, name: 'Acme Corp', projects: [] };
    mockService.create.mockResolvedValue(created as never);

    const res = await request(app)
      .post('/api/clientes')
      .send({ name: 'Acme Corp' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ data: created, message: expect.any(String) });
    expect(mockService.create).toHaveBeenCalledWith({ name: 'Acme Corp' });
  });

  it('deve retornar 400 quando o campo name está ausente', async () => {
    // Cenário: payload sem name → validateRequest rejeita antes de chamar o service.
    const res = await request(app)
      .post('/api/clientes')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando name tem menos de 2 caracteres', async () => {
    // Cenário: name muito curto → schema Zod rejeita (min 2).
    const res = await request(app)
      .post('/api/clientes')
      .send({ name: 'X' });

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando name tem mais de 100 caracteres', async () => {
    // Cenário: name excede limite máximo do schema.
    const longName = 'A'.repeat(101);
    const res = await request(app)
      .post('/api/clientes')
      .send({ name: longName });

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 409 quando o service lança AppError de conflito', async () => {
    // Cenário: service detecta conflito (ex: nome duplicado) → errorHandler mapeia para 409.
    mockService.create.mockRejectedValue(new AppError('Conflito de dados', 409) as never);

    const res = await request(app)
      .post('/api/clientes')
      .send({ name: 'Cliente Duplicado' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('Conflito de dados');
  });

  it('deve retornar 500 quando o service lança erro inesperado', async () => {
    // Cenário: erro não operacional (ex: falha de infraestrutura) → 500 com mensagem genérica.
    mockService.create.mockRejectedValue(new Error('DB offline') as never);

    const res = await request(app)
      .post('/api/clientes')
      .send({ name: 'Cliente Teste' });

    expect(res.status).toBe(500);
    expect(res.body.error.message).toBe('Erro interno do servidor');
  });
});

// ── GET /api/clientes ─────────────────────────────────────────────────────────

describe('GET /api/clientes', () => {
  it('deve retornar 200 com lista de clientes', async () => {
    // Cenário: banco retorna dois clientes.
    const clientes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    mockService.findAll.mockResolvedValue(clientes as never);

    const res = await request(app).get('/api/clientes');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(clientes);
  });

  it('deve retornar 200 com lista vazia quando não há clientes', async () => {
    // Cenário: banco sem clientes — resposta válida com array vazio.
    mockService.findAll.mockResolvedValue([] as never);

    const res = await request(app).get('/api/clientes');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
