import { AppDataSource } from '../database/dataSource';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';
import { AppError } from '../errors/AppError';
import {
  CreateEntradaFinanceiraInput,
  UpdateEntradaFinanceiraInput,
} from '../schemas/entradaFinanceira.schema';

// Serviço de negócio para entradas financeiras.
export class EntradaFinanceiraService {
  private repo = AppDataSource.getRepository(EntradaFinanceira);

  async findAll(): Promise<EntradaFinanceira[]> {
    return this.repo.find({ relations: ['atualizacaoMensal'] });
  }

  async findById(id: number): Promise<EntradaFinanceira> {
    const entrada = await this.repo.findOne({
      where: { id },
      relations: ['atualizacaoMensal'],
    });
    if (!entrada) throw new AppError('Entrada financeira não encontrada', 404);
    return entrada;
  }

  async findByAtualizacaoMensal(atualizacaoMensalId: number): Promise<EntradaFinanceira[]> {
    return this.repo.find({
      where: { atualizacaoMensalId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: CreateEntradaFinanceiraInput): Promise<EntradaFinanceira> {
    const entrada = this.repo.create(data);
    return this.repo.save(entrada);
  }

  async update(id: number, data: UpdateEntradaFinanceiraInput): Promise<EntradaFinanceira> {
    const entrada = await this.findById(id);
    Object.assign(entrada, data);
    return this.repo.save(entrada);
  }

  async delete(id: number): Promise<void> {
    const entrada = await this.findById(id);
    await this.repo.remove(entrada);
  }
}
