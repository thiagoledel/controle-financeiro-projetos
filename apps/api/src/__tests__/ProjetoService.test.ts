import { Repository } from 'typeorm';
import { ProjetoService } from '../services/ProjetoService';
import { Projeto } from '../entities/Projeto';
import { Cliente } from '../entities/Cliente';
import { AppError } from '../errors/AppError';

// Mocks separados para o repositório de Projeto e de Cliente (dependência de validação de FK).
const makeProjetoRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const makeClienteRepo = () => ({
  findOne: jest.fn(),
});

describe('ProjetoService', () => {
  let service: ProjetoService;
  let projetoRepo: ReturnType<typeof makeProjetoRepo>;
  let clienteRepo: ReturnType<typeof makeClienteRepo>;

  beforeEach(() => {
    // Recria os mocks antes de cada teste para isolamento completo.
    projetoRepo = makeProjetoRepo();
    clienteRepo = makeClienteRepo();
    service = new ProjetoService(
      projetoRepo as unknown as Repository<Projeto>,
      clienteRepo as unknown as Repository<Cliente>,
    );
  });

  // ── findAll ──────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return a list of projects with their clients', async () => {
      // Cenário: banco retorna dois projetos com cliente associado.
      const projects = [
        { id: 1, name: 'Projeto A', cliente: { id: 1, name: 'Cliente A' } },
        { id: 2, name: 'Projeto B', cliente: { id: 1, name: 'Cliente A' } },
      ];
      projetoRepo.find.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(result).toEqual(projects);
      expect(projetoRepo.find).toHaveBeenCalledWith({ relations: ['cliente'] });
    });
  });

  // ── findById ─────────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return the project with relations when found', async () => {
      // Cenário: projeto existe e retorna cliente + atualizações aninhadas.
      const project = {
        id: 1,
        name: 'Projeto A',
        cliente: { id: 1 },
        updates: [],
      };
      projetoRepo.findOne.mockResolvedValue(project);

      const result = await service.findById(1);

      expect(result).toEqual(project);
      expect(projetoRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cliente', 'updates', 'updates.entries'],
      });
    });

    it('should throw AppError 404 when project does not exist', async () => {
      // Cenário: ID inexistente — deve lançar erro de negócio com status 404.
      projetoRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(AppError);
      await expect(service.findById(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ───────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return the project when cliente exists', async () => {
      // Cenário: criação bem-sucedida após validar que o cliente pai existe.
      const input = { name: 'Novo Projeto', clienteId: 1 };
      const created = { id: 1, ...input, cliente: { id: 1 } };
      clienteRepo.findOne.mockResolvedValue({ id: 1, name: 'Cliente A' });
      projetoRepo.create.mockReturnValue(created);
      projetoRepo.save.mockResolvedValue(created);

      const result = await service.create(input);

      expect(result).toEqual(created);
      expect(clienteRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw AppError 404 when cliente does not exist', async () => {
      // Cenário: clienteId inválido — validação de entidade pai inexistente.
      clienteRepo.findOne.mockResolvedValue(null);

      await expect(service.create({ name: 'Projeto X', clienteId: 999 })).rejects.toThrow(AppError);
      await expect(
        service.create({ name: 'Projeto X', clienteId: 999 }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── update ───────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the modified project', async () => {
      // Cenário: atualização bem-sucedida de nome do projeto.
      const existing = { id: 1, name: 'Nome Antigo', cliente: { id: 1 }, updates: [] };
      const saved = { ...existing, name: 'Nome Novo' };
      projetoRepo.findOne.mockResolvedValue(existing);
      projetoRepo.save.mockResolvedValue(saved);

      const result = await service.update(1, { name: 'Nome Novo' });

      expect(result.name).toBe('Nome Novo');
    });

    it('should throw AppError 404 when project does not exist', async () => {
      // Cenário: tentativa de atualizar projeto inexistente.
      projetoRepo.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── delete ───────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete the project successfully', async () => {
      // Cenário: remoção bem-sucedida de um projeto existente.
      const project = { id: 1, name: 'Projeto A', cliente: { id: 1 }, updates: [] };
      projetoRepo.findOne.mockResolvedValue(project);
      projetoRepo.remove.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(projetoRepo.remove).toHaveBeenCalledWith(project);
    });

    it('should throw AppError 404 when project does not exist', async () => {
      // Cenário: tentativa de remover projeto inexistente.
      projetoRepo.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
