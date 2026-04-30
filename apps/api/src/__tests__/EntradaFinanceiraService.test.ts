import { Repository } from 'typeorm';
import { EntradaFinanceiraService } from '../services/EntradaFinanceiraService';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { AppError } from '../errors/AppError';

// Mocks separados para os repositórios de EntradaFinanceira e AtualizacaoMensal.
const makeEntradaRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const makeAtualizacaoRepo = () => ({
  findOne: jest.fn(),
});

describe('EntradaFinanceiraService', () => {
  let service: EntradaFinanceiraService;
  let entradaRepo: ReturnType<typeof makeEntradaRepo>;
  let atualizacaoRepo: ReturnType<typeof makeAtualizacaoRepo>;

  beforeEach(() => {
    // Recria os mocks antes de cada teste para isolamento completo.
    entradaRepo = makeEntradaRepo();
    atualizacaoRepo = makeAtualizacaoRepo();
    service = new EntradaFinanceiraService(
      entradaRepo as unknown as Repository<EntradaFinanceira>,
      atualizacaoRepo as unknown as Repository<AtualizacaoMensal>,
    );
  });

  // ── findByAtualizacao ─────────────────────────────────────────────────────────

  describe('findByAtualizacao', () => {
    it('should return entries for the given update ordered by createdAt desc', async () => {
      // Cenário: banco retorna entradas da atualização 1, ordenadas por data de criação.
      const entries = [
        { id: 2, atualizacaoMensalId: 1, revenue: 5000, margin: 30, description: 'Serviço B' },
        { id: 1, atualizacaoMensalId: 1, revenue: 3000, margin: 25, description: 'Serviço A' },
      ];
      entradaRepo.find.mockResolvedValue(entries);

      const result = await service.findByAtualizacao(1);

      expect(result).toEqual(entries);
      expect(entradaRepo.find).toHaveBeenCalledWith({
        where: { atualizacaoMensalId: 1 },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when update has no entries', async () => {
      // Cenário: atualização existe mas sem entradas financeiras.
      entradaRepo.find.mockResolvedValue([]);

      const result = await service.findByAtualizacao(1);

      expect(result).toEqual([]);
    });
  });

  // ── findByIdAndAtualizacao ────────────────────────────────────────────────────

  describe('findByIdAndAtualizacao', () => {
    it('should return entry when found for the given update', async () => {
      // Cenário: entrada pertence à atualização informada — retorno correto.
      const entry = { id: 1, atualizacaoMensalId: 1, revenue: 3000, margin: 25, description: 'Serviço A' };
      entradaRepo.findOne.mockResolvedValue(entry);

      const result = await service.findByIdAndAtualizacao(1, 1);

      expect(result).toEqual(entry);
      expect(entradaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, atualizacaoMensalId: 1 },
      });
    });

    it('should throw AppError 404 when entry does not belong to the update', async () => {
      // Cenário: ID existe mas pertence a outra atualização (proteção cross-atualização).
      entradaRepo.findOne.mockResolvedValue(null);

      await expect(service.findByIdAndAtualizacao(1, 99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ───────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create entry when atualizacao exists', async () => {
      // Cenário: criação bem-sucedida após validar que a atualização mensal pai existe.
      const input = { revenue: 8000, margin: 40, description: 'Consultoria técnica' };
      const created = { id: 1, atualizacaoMensalId: 1, ...input };
      atualizacaoRepo.findOne.mockResolvedValue({ id: 1 });
      entradaRepo.create.mockReturnValue(created);
      entradaRepo.save.mockResolvedValue(created);

      const result = await service.create(input, 1);

      expect(result).toEqual(created);
      expect(atualizacaoRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(entradaRepo.create).toHaveBeenCalledWith({ ...input, atualizacaoMensalId: 1 });
    });

    it('should throw AppError 404 when atualizacao does not exist', async () => {
      // Cenário: atualizacaoId inválido — validação de entidade pai inexistente.
      atualizacaoRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ revenue: 1000, margin: 20, description: 'Teste' }, 999),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── update ───────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the modified entry', async () => {
      // Cenário: atualização parcial bem-sucedida de receita e margem.
      const existing = { id: 1, atualizacaoMensalId: 1, revenue: 3000, margin: 25, description: 'Serviço A' };
      const saved = { ...existing, revenue: 5000, margin: 35 };
      entradaRepo.findOne.mockResolvedValue(existing);
      entradaRepo.save.mockResolvedValue(saved);

      const result = await service.update(1, { revenue: 5000, margin: 35 }, 1);

      expect(result.revenue).toBe(5000);
      expect(result.margin).toBe(35);
    });

    it('should throw AppError 404 when entry does not exist', async () => {
      // Cenário: tentativa de atualizar entrada inexistente.
      entradaRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { revenue: 1000 }, 1),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete entry successfully', async () => {
      // Cenário: remoção bem-sucedida de uma entrada financeira existente.
      const entry = { id: 1, atualizacaoMensalId: 1, revenue: 3000, margin: 25, description: 'X' };
      entradaRepo.findOne.mockResolvedValue(entry);
      entradaRepo.remove.mockResolvedValue(undefined);

      await expect(service.delete(1, 1)).resolves.toBeUndefined();
      expect(entradaRepo.remove).toHaveBeenCalledWith(entry);
    });

    it('should throw AppError 404 when entry does not exist', async () => {
      // Cenário: tentativa de remover entrada inexistente ou de outra atualização.
      entradaRepo.findOne.mockResolvedValue(null);

      await expect(service.delete(999, 1)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
