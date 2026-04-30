import { Repository } from 'typeorm';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { AppError } from '../errors/AppError';
import {
  CreateEntradaFinanceiraInput,
  UpdateEntradaFinanceiraInput,
} from '../schemas/entradaFinanceira.schema';

// Serviço de negócio para entradas financeiras de uma atualização mensal.
// Recebe dois repositórios via construtor: EntradaFinanceira e AtualizacaoMensal (para validar FK).
export class EntradaFinanceiraService {
  constructor(
    private readonly repo: Repository<EntradaFinanceira>,
    // Repositório de AtualizacaoMensal injetado para validar existência antes de criar entrada.
    private readonly atualizacaoRepo: Repository<AtualizacaoMensal>,
  ) {}

  // Retorna todas as entradas de uma atualização mensal, ordenadas pela data de criação.
  async findByAtualizacao(atualizacaoId: number): Promise<EntradaFinanceira[]> {
    return this.repo.find({
      where: { atualizacaoMensalId: atualizacaoId },
      order: { createdAt: 'DESC' },
    });
  }

  // Busca entrada por ID verificando que pertence à atualização informada na rota.
  async findByIdAndAtualizacao(
    id: number,
    atualizacaoId: number,
  ): Promise<EntradaFinanceira> {
    const entrada = await this.repo.findOne({
      where: { id, atualizacaoMensalId: atualizacaoId },
    });
    if (!entrada) throw new AppError('Entrada financeira não encontrada', 404);
    return entrada;
  }

  // Cria entrada financeira após verificar que a atualização mensal existe.
  // O atualizacaoMensalId vem do parâmetro de rota, não do body da requisição.
  async create(
    data: CreateEntradaFinanceiraInput,
    atualizacaoId: number,
  ): Promise<EntradaFinanceira> {
    const atualizacaoExists = await this.atualizacaoRepo.findOne({
      where: { id: atualizacaoId },
    });
    if (!atualizacaoExists) throw new AppError('Atualização mensal não encontrada', 404);

    const entrada = this.repo.create({ ...data, atualizacaoMensalId: atualizacaoId });
    return this.repo.save(entrada);
  }

  // Atualiza os campos fornecidos de uma entrada existente; lança 404 se não existir.
  async update(
    id: number,
    data: UpdateEntradaFinanceiraInput,
    atualizacaoId: number,
  ): Promise<EntradaFinanceira> {
    const entrada = await this.findByIdAndAtualizacao(id, atualizacaoId);
    Object.assign(entrada, data);
    return this.repo.save(entrada);
  }

  // Remove a entrada financeira; lança 404 se não existir ou não pertencer à atualização.
  async delete(id: number, atualizacaoId: number): Promise<void> {
    const entrada = await this.findByIdAndAtualizacao(id, atualizacaoId);
    await this.repo.remove(entrada);
  }
}
