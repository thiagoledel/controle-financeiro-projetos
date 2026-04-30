import { Repository } from 'typeorm';
import { AtualizacaoMensalService } from '../services/AtualizacaoMensalService';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { Projeto } from '../entities/Projeto';
import { AppError } from '../errors/AppError';

// Mocks separados para os repositórios de AtualizacaoMensal e Projeto.
const makeAtualizacaoRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const makeProjetoRepo = () => ({
  findOne: jest.fn(),
});

describe('AtualizacaoMensalService', () => {
  let service: AtualizacaoMensalService;
  let atualizacaoRepo: ReturnType<typeof makeAtualizacaoRepo>;
  let projetoRepo: ReturnType<typeof makeProjetoRepo>;

  beforeEach(() => {
    // Recria os mocks antes de cada teste para isolamento completo.
    atualizacaoRepo = makeAtualizacaoRepo();
    projetoRepo = makeProjetoRepo();
    service = new AtualizacaoMensalService(
      atualizacaoRepo as unknown as Repository<AtualizacaoMensal>,
      projetoRepo as unknown as Repository<Projeto>,
    );
  });

  // ── findByProjeto ─────────────────────────────────────────────────────────────

  describe('findByProjeto', () => {
    it('should return updates for the given project ordered by year/month desc', async () => {
      // Cenário: banco retorna atualizações do projeto 1, ordenadas por data decrescente.
      const updates = [
        { id: 2, projetoId: 1, month: 3, year: 2025, entries: [] },
        { id: 1, projetoId: 1, month: 1, year: 2025, entries: [] },
      ];
      atualizacaoRepo.find.mockResolvedValue(updates);

      const result = await service.findByProjeto(1);

      expect(result).toEqual(updates);
      expect(atualizacaoRepo.find).toHaveBeenCalledWith({
        where: { projetoId: 1 },
        relations: ['entries'],
        order: { year: 'DESC', month: 'DESC' },
      });
    });

    it('should return empty array when project has no updates', async () => {
      // Cenário: projeto existe mas sem atualizações cadastradas.
      atualizacaoRepo.find.mockResolvedValue([]);

      const result = await service.findByProjeto(1);

      expect(result).toEqual([]);
    });
  });

  // ── findByIdAndProjeto ────────────────────────────────────────────────────────

  describe('findByIdAndProjeto', () => {
    it('should return the update when found for the given project', async () => {
      // Cenário: atualização pertence ao projeto informado — retorno com entradas.
      const update = { id: 1, projetoId: 1, month: 1, year: 2025, entries: [] };
      atualizacaoRepo.findOne.mockResolvedValue(update);

      const result = await service.findByIdAndProjeto(1, 1);

      expect(result).toEqual(update);
      expect(atualizacaoRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, projetoId: 1 },
        relations: ['entries'],
      });
    });

    it('should throw AppError 404 when update does not belong to the project', async () => {
      // Cenário: ID existe mas pertence a outro projeto (proteção cross-projeto).
      atualizacaoRepo.findOne.mockResolvedValue(null);

      await expect(service.findByIdAndProjeto(1, 99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ───────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create update when project exists', async () => {
      // Cenário: criação bem-sucedida após validar que o projeto pai existe.
      const input = { month: 4, year: 2025 };
      const created = { id: 1, projetoId: 1, ...input, entries: [] };
      projetoRepo.findOne.mockResolvedValue({ id: 1, name: 'Projeto A' });
      atualizacaoRepo.create.mockReturnValue(created);
      atualizacaoRepo.save.mockResolvedValue(created);

      const result = await service.create(input, 1);

      expect(result).toEqual(created);
      expect(projetoRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(atualizacaoRepo.create).toHaveBeenCalledWith({ ...input, projetoId: 1 });
    });

    it('should throw AppError 404 when project does not exist', async () => {
      // Cenário: projetoId inválido — validação de entidade pai inexistente.
      projetoRepo.findOne.mockResolvedValue(null);

      await expect(service.create({ month: 1, year: 2025 }, 999)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('should propagate unique constraint error for duplicate month/year/project', async () => {
      // Cenário: violação da constraint UNIQUE (projeto_id, mes, ano) — o banco lançará erro
      // de unique_violation (código 23505), que o errorHandler mapeia para 409.
      // Aqui simulamos o save lançando um erro genérico para testar a propagação.
      projetoRepo.findOne.mockResolvedValue({ id: 1 });
      atualizacaoRepo.create.mockReturnValue({ month: 1, year: 2025, projetoId: 1 });
      atualizacaoRepo.save.mockRejectedValue(new Error('unique_violation'));

      await expect(service.create({ month: 1, year: 2025 }, 1)).rejects.toThrow('unique_violation');
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete update and cascade its entries', async () => {
      // Cenário: remoção da atualização — entradas são removidas em cascade pelo banco.
      const update = { id: 1, projetoId: 1, month: 1, year: 2025, entries: [{ id: 5 }] };
      atualizacaoRepo.findOne.mockResolvedValue(update);
      atualizacaoRepo.remove.mockResolvedValue(undefined);

      await expect(service.delete(1, 1)).resolves.toBeUndefined();
      expect(atualizacaoRepo.remove).toHaveBeenCalledWith(update);
    });

    it('should throw AppError 404 when update does not exist', async () => {
      // Cenário: tentativa de remover atualização inexistente.
      atualizacaoRepo.findOne.mockResolvedValue(null);

      await expect(service.delete(999, 1)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
