import { AppDataSource } from '../database/dataSource';
import { Projeto } from '../entities/Projeto';
import { AppError } from '../errors/AppError';
import { CreateProjetoInput, UpdateProjetoInput } from '../schemas/projeto.schema';

// Serviço de negócio para gerenciamento de projetos.
export class ProjetoService {
  private repo = AppDataSource.getRepository(Projeto);

  async findAll(): Promise<Projeto[]> {
    return this.repo.find({ relations: ['cliente'] });
  }

  async findById(id: number): Promise<Projeto> {
    const projeto = await this.repo.findOne({
      where: { id },
      relations: ['cliente', 'updates', 'updates.entries'],
    });
    if (!projeto) throw new AppError('Projeto não encontrado', 404);
    return projeto;
  }

  async create(data: CreateProjetoInput): Promise<Projeto> {
    const projeto = this.repo.create(data);
    return this.repo.save(projeto);
  }

  async update(id: number, data: UpdateProjetoInput): Promise<Projeto> {
    const projeto = await this.findById(id);
    Object.assign(projeto, data);
    return this.repo.save(projeto);
  }

  async delete(id: number): Promise<void> {
    const projeto = await this.findById(id);
    await this.repo.remove(projeto);
  }
}
