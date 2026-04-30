import { Repository } from 'typeorm';
import { ClienteService } from '../services/ClienteService';
import { Cliente } from '../entities/Cliente';
import { AppError } from '../errors/AppError';

// Mock parcial do repositório TypeORM — substitui chamadas reais ao banco por jest.fn().
const makeRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: ReturnType<typeof makeRepo>;

  beforeEach(() => {
    // Recria o mock antes de cada teste para evitar contaminação de estado entre cenários.
    repo = makeRepo();
    service = new ClienteService(repo as unknown as Repository<Cliente>);
  });

  // ── findAll ──────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return a list of clients with their projects', async () => {
      // Cenário: banco retorna dois clientes com projetos associados.
      const clients = [
        { id: 1, name: 'Cliente A', projects: [] },
        { id: 2, name: 'Cliente B', projects: [{ id: 10 }] },
      ];
      repo.find.mockResolvedValue(clients);

      const result = await service.findAll();

      expect(result).toEqual(clients);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['projects'] });
    });

    it('should return an empty array when there are no clients', async () => {
      // Cenário: banco sem clientes cadastrados.
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── findById ─────────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return the client when found', async () => {
      // Cenário: cliente com ID 1 existe no banco.
      const client = { id: 1, name: 'Cliente A', projects: [] };
      repo.findOne.mockResolvedValue(client);

      const result = await service.findById(1);

      expect(result).toEqual(client);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['projects'],
      });
    });

    it('should throw AppError 404 when client does not exist', async () => {
      // Cenário: ID inexistente no banco — deve lançar erro de negócio.
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(AppError);
      await expect(service.findById(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ───────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return the new client', async () => {
      // Cenário: criação bem-sucedida com dados válidos.
      const input = { name: 'Novo Cliente' };
      const created = { id: 1, ...input, projects: [], createdAt: new Date(), updatedAt: new Date() };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(input);
      expect(repo.save).toHaveBeenCalledWith(created);
    });
  });

  // ── update ───────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the modified client', async () => {
      // Cenário: atualização bem-sucedida de um cliente existente.
      const existing = { id: 1, name: 'Nome Antigo', projects: [] };
      const saved = { ...existing, name: 'Nome Novo' };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue(saved);

      const result = await service.update(1, { name: 'Nome Novo' });

      expect(result.name).toBe('Nome Novo');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw AppError 404 when client does not exist', async () => {
      // Cenário: tentativa de atualizar cliente inexistente.
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toThrow(AppError);
      await expect(service.update(999, { name: 'X' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete the client successfully when it has no projects', async () => {
      // Cenário: remoção bem-sucedida de cliente sem projetos vinculados.
      const client = { id: 1, name: 'Cliente A', projects: [] };
      repo.findOne.mockResolvedValue(client);
      repo.remove.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(client);
    });

    it('should throw AppError 409 when client has linked projects', async () => {
      // Cenário: remoção bloqueada por projetos vinculados — regra de integridade de negócio.
      const client = { id: 1, name: 'Cliente A', projects: [{ id: 10 }, { id: 11 }] };
      repo.findOne.mockResolvedValue(client);

      await expect(service.delete(1)).rejects.toThrow(AppError);
      await expect(service.delete(1)).rejects.toMatchObject({ statusCode: 409 });
    });

    it('should throw AppError 404 when client does not exist', async () => {
      // Cenário: tentativa de remover cliente inexistente.
      repo.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(AppError);
      await expect(service.delete(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
