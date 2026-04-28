import { AppDataSource } from '../database/dataSource';
import { Cliente } from '../entities/Cliente';
import { AppError } from '../errors/AppError';
import { CreateClienteInput, UpdateClienteInput } from '../schemas/cliente.schema';

// Serviço de negócio para gerenciamento de clientes.
// Concentra todas as regras e consultas ao repositório.
export class ClienteService {
  private repo = AppDataSource.getRepository(Cliente);

  async findAll(): Promise<Cliente[]> {
    return this.repo.find({ relations: ['projects'] });
  }

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.repo.findOne({
      where: { id },
      relations: ['projects'],
    });
    if (!cliente) throw new AppError('Cliente não encontrado', 404);
    return cliente;
  }

  async create(data: CreateClienteInput): Promise<Cliente> {
    const cliente = this.repo.create(data);
    return this.repo.save(cliente);
  }

  async update(id: number, data: UpdateClienteInput): Promise<Cliente> {
    const cliente = await this.findById(id);
    Object.assign(cliente, data);
    return this.repo.save(cliente);
  }

  async delete(id: number): Promise<void> {
    const cliente = await this.findById(id);
    await this.repo.remove(cliente);
  }
}
