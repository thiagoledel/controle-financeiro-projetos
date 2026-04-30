import { Repository } from 'typeorm';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { Projeto } from '../entities/Projeto';
import { AppError } from '../errors/AppError';
import { CreateAtualizacaoMensalInput } from '../schemas/atualizacaoMensal.schema';

// Serviço de negócio para atualizações mensais de projetos.
// Recebe dois repositórios via construtor: AtualizacaoMensal e Projeto (para validar FK).
export class AtualizacaoMensalService {
  constructor(
    private readonly repo: Repository<AtualizacaoMensal>,
    // Repositório do Projeto injetado para validar existência antes de criar a atualização.
    private readonly projetoRepo: Repository<Projeto>,
  ) {}

  // Retorna todas as atualizações de um projeto, ordenadas por ano/mês decrescentes.
  async findByProjeto(projetoId: number): Promise<AtualizacaoMensal[]> {
    return this.repo.find({
      where: { projetoId },
      relations: ['entries'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  // Busca atualização por ID verificando que pertence ao projeto informado na rota.
  // Isso evita acesso cross-projeto via manipulação de URL.
  async findByIdAndProjeto(
    id: number,
    projetoId: number,
  ): Promise<AtualizacaoMensal> {
    const atualizacao = await this.repo.findOne({
      where: { id, projetoId },
      relations: ['entries'],
    });
    if (!atualizacao) throw new AppError('Atualização mensal não encontrada', 404);
    return atualizacao;
  }

  // Cria atualização mensal após verificar que o projeto existe.
  // O projetoId vem do parâmetro de rota, não do body da requisição.
  async create(
    data: CreateAtualizacaoMensalInput,
    projetoId: number,
  ): Promise<AtualizacaoMensal> {
    const projetoExists = await this.projetoRepo.findOne({
      where: { id: projetoId },
    });
    if (!projetoExists) throw new AppError('Projeto não encontrado', 404);

    const atualizacao = this.repo.create({ ...data, projetoId });
    return this.repo.save(atualizacao);
  }

  // Remove a atualização e suas entradas financeiras (cascade pelo banco via FK ON DELETE CASCADE).
  async delete(id: number, projetoId: number): Promise<void> {
    const atualizacao = await this.findByIdAndProjeto(id, projetoId);
    await this.repo.remove(atualizacao);
  }
}
