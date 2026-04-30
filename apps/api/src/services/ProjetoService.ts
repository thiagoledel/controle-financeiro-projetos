import { Repository } from 'typeorm';
import { Projeto } from '../entities/Projeto';
import { Cliente } from '../entities/Cliente';
import { AppError } from '../errors/AppError';
import { CreateProjetoInput, UpdateProjetoInput } from '../schemas/projeto.schema';

// Serviço de negócio para gerenciamento de projetos.
// Recebe dois repositórios via construtor: o de Projeto e o de Cliente (para validar FK).
export class ProjetoService {
  constructor(
    private readonly repo: Repository<Projeto>,
    // Repositório do Cliente injetado para validar existência antes de criar o projeto.
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  // Retorna todos os projetos com o cliente associado.
  async findAll(): Promise<Projeto[]> {
    return this.repo.find({ relations: ['cliente'] });
  }

  // Busca projeto por ID incluindo cliente e atualizações mensais com suas entradas.
  async findById(id: number): Promise<Projeto> {
    const projeto = await this.repo.findOne({
      where: { id },
      relations: ['cliente', 'updates', 'updates.entries'],
    });
    if (!projeto) throw new AppError('Projeto não encontrado', 404);
    return projeto;
  }

  // Cria projeto após verificar que o cliente pai existe; lança 404 se o cliente não existir.
  async create(data: CreateProjetoInput): Promise<Projeto> {
    const clienteExists = await this.clienteRepo.findOne({
      where: { id: data.clienteId },
    });
    if (!clienteExists) throw new AppError('Cliente não encontrado', 404);

    const projeto = this.repo.create(data);
    return this.repo.save(projeto);
  }

  // Atualiza os campos fornecidos de um projeto existente; lança 404 se não existir.
  async update(id: number, data: UpdateProjetoInput): Promise<Projeto> {
    const projeto = await this.findById(id);
    Object.assign(projeto, data);
    return this.repo.save(projeto);
  }

  // Remove projeto; lança 404 se não existir.
  async delete(id: number): Promise<void> {
    const projeto = await this.findById(id);
    await this.repo.remove(projeto);
  }
}
