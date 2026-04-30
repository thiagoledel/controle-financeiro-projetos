import { Repository } from 'typeorm';
import { Cliente } from '../entities/Cliente';
import { AppError } from '../errors/AppError';
import { CreateClienteInput, UpdateClienteInput } from '../schemas/cliente.schema';

// Serviço de negócio para gerenciamento de clientes.
// O repositório é injetado via construtor para permitir substituição em testes (mock).
export class ClienteService {
  constructor(private readonly repo: Repository<Cliente>) {}

  // Retorna todos os clientes com seus projetos vinculados (inclui contagem implícita via array).
  async findAll(): Promise<Cliente[]> {
    return this.repo.find({ relations: ['projects'] });
  }

  // Busca cliente por ID incluindo projetos; lança 404 se não existir.
  async findById(id: number): Promise<Cliente> {
    const cliente = await this.repo.findOne({
      where: { id },
      relations: ['projects'],
    });
    if (!cliente) throw new AppError('Cliente não encontrado', 404);
    return cliente;
  }

  // Cria e persiste um novo cliente com os dados validados.
  async create(data: CreateClienteInput): Promise<Cliente> {
    const cliente = this.repo.create(data);
    return this.repo.save(cliente);
  }

  // Atualiza os campos fornecidos de um cliente existente; lança 404 se não existir.
  async update(id: number, data: UpdateClienteInput): Promise<Cliente> {
    const cliente = await this.findById(id);
    Object.assign(cliente, data);
    return this.repo.save(cliente);
  }

  // Remove o cliente; lança 409 se houver projetos vinculados, 404 se não existir.
  async delete(id: number): Promise<void> {
    const cliente = await this.findById(id);
    if (cliente.projects && cliente.projects.length > 0) {
      throw new AppError(
        'Cliente possui projetos vinculados e não pode ser removido',
        409,
      );
    }
    await this.repo.remove(cliente);
  }
}
