import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { Router } from 'express';
import { AtualizacaoMensalController } from '../../controllers/AtualizacaoMensalController';
import { AtualizacaoMensalService } from '../../services/AtualizacaoMensalService';
import { validateRequest } from '../../middlewares/validateRequest';
import { createAtualizacaoMensalSchema } from '../../schemas/atualizacaoMensal.schema';
import { errorHandler } from '../../middlewares/errorHandler';
import { AppError } from '../../errors/AppError';
import { QueryFailedError } from 'typeorm';

// Monta app Express mínimo com mock do serviço — sem banco de dados.
// Testa: rota aninhada /projetos/:projetoId/atualizacoes → validateRequest → controller → errorHandler.
function buildApp(mockService: Partial<AtualizacaoMensalService>) {
  const app = express();
  app.use(express.json());

  const ctrl = new AtualizacaoMensalController(mockService as AtualizacaoMensalService);
  const router = Router({ mergeParams: true });

  router.get('/projetos/:projetoId/atualizacoes', ctrl.index);
  router.post(
    '/projetos/:projetoId/atualizacoes',
    validateRequest(createAtualizacaoMensalSchema),
    ctrl.create,
  );

  app.use('/api', router);
  app.use(errorHandler);
  return app;
}

const mockService: jest.Mocked<
  Pick<AtualizacaoMensalService, 'findByProjeto' | 'findByIdAndProjeto' | 'create' | 'delete'>
> = {
  findByProjeto: jest.fn(),
  findByIdAndProjeto: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

const app = buildApp(mockService as unknown as AtualizacaoMensalService);

// ── POST /api/projetos/:projetoId/atualizacoes ────────────────────────────────

describe('POST /api/projetos/:projetoId/atualizacoes', () => {
  it('deve criar atualização e retornar 201 com { data, message }', async () => {
    // Cenário: payload válido → service cria atualização → retorna 201.
    const created = { id: 1, projetoId: 5, month: 4, year: 2025, entries: [] };
    mockService.create.mockResolvedValue(created as never);

    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({ month: 4, year: 2025 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ data: created, message: expect.any(String) });
    expect(mockService.create).toHaveBeenCalledWith({ month: 4, year: 2025 }, 5);
  });

  it('deve retornar 400 quando month está fora do intervalo 1-12', async () => {
    // Cenário: month = 13 → schema Zod rejeita (max 12) → validateRequest retorna 400.
    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({ month: 13, year: 2025 });

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando month = 0 (abaixo do mínimo)', async () => {
    // Cenário: month = 0 → schema Zod rejeita (min 1).
    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({ month: 0, year: 2025 });

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando year está fora do intervalo 2000-2100', async () => {
    // Cenário: year = 1999 → schema Zod rejeita (min 2000).
    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({ month: 1, year: 1999 });

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando payload está vazio', async () => {
    // Cenário: campos obrigatórios ausentes → schema rejeita.
    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({});

    expect(res.status).toBe(400);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('deve retornar 409 quando há violação de unique constraint (mês/ano duplicado)', async () => {
    // Cenário: mesmo mês/ano já existe para o projeto → QueryFailedError com code 23505
    // → errorHandler mapeia para 409.
    const pgError = Object.assign(new QueryFailedError('', [], new Error()), {
      driverError: { code: '23505' },
    });
    mockService.create.mockRejectedValue(pgError as never);

    const res = await request(app)
      .post('/api/projetos/5/atualizacoes')
      .send({ month: 4, year: 2025 });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toMatch(/mês\/ano/i);
  });

  it('deve retornar 404 quando o projeto não existe', async () => {
    // Cenário: service lança AppError 404 porque o projetoId não foi encontrado.
    mockService.create.mockRejectedValue(new AppError('Projeto não encontrado', 404) as never);

    const res = await request(app)
      .post('/api/projetos/999/atualizacoes')
      .send({ month: 1, year: 2025 });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Projeto não encontrado');
  });
});

// ── GET /api/projetos/:projetoId/atualizacoes ─────────────────────────────────

describe('GET /api/projetos/:projetoId/atualizacoes', () => {
  it('deve retornar 200 com lista de atualizações do projeto', async () => {
    // Cenário: banco retorna duas atualizações para o projeto 5.
    const updates = [
      { id: 2, projetoId: 5, month: 3, year: 2025, entries: [] },
      { id: 1, projetoId: 5, month: 1, year: 2025, entries: [] },
    ];
    mockService.findByProjeto.mockResolvedValue(updates as never);

    const res = await request(app).get('/api/projetos/5/atualizacoes');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(updates);
    expect(mockService.findByProjeto).toHaveBeenCalledWith(5);
  });
});
