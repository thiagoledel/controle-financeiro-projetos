import { AppDataSource } from '../database/dataSource';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { AppError } from '../errors/AppError';
import {
  CreateAtualizacaoMensalInput,
  UpdateAtualizacaoMensalInput,
} from '../schemas/atualizacaoMensal.schema';

// Serviço de negócio para atualizações mensais de projetos.
export class AtualizacaoMensalService {
  private repo = AppDataSource.getRepository(AtualizacaoMensal);

  async findAll(): Promise<AtualizacaoMensal[]> {
    return this.repo.find({ relations: ['projeto', 'entries'] });
  }

  async findById(id: number): Promise<AtualizacaoMensal> {
    const atualizacao = await this.repo.findOne({
      where: { id },
      relations: ['projeto', 'entries'],
    });
    if (!atualizacao) throw new AppError('Atualização mensal não encontrada', 404);
    return atualizacao;
  }

  async findByProjeto(projetoId: number): Promise<AtualizacaoMensal[]> {
    return this.repo.find({
      where: { projetoId },
      relations: ['entries'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async create(data: CreateAtualizacaoMensalInput): Promise<AtualizacaoMensal> {
    const atualizacao = this.repo.create(data);
    return this.repo.save(atualizacao);
  }

  async update(id: number, data: UpdateAtualizacaoMensalInput): Promise<AtualizacaoMensal> {
    const atualizacao = await this.findById(id);
    Object.assign(atualizacao, data);
    return this.repo.save(atualizacao);
  }

  async delete(id: number): Promise<void> {
    const atualizacao = await this.findById(id);
    await this.repo.remove(atualizacao);
  }
}
