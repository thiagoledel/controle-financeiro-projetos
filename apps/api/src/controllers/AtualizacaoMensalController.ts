import { Request, Response, NextFunction } from 'express';
import { AtualizacaoMensalService } from '../services/AtualizacaoMensalService';

// Controller de atualizações mensais.
// Lê o projetoId do parâmetro de rota :projetoId (rota aninhada /projetos/:projetoId/atualizacoes).
export class AtualizacaoMensalController {
  constructor(private readonly service: AtualizacaoMensalService) {}

  // Lista todas as atualizações do projeto especificado na rota.
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findByProjeto(Number(req.params.projetoId));
      res.json({ data, message: 'Atualizações mensais recuperadas com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  // Busca atualização por ID verificando que pertence ao projeto da rota.
  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findByIdAndProjeto(
        Number(req.params.id),
        Number(req.params.projetoId),
      );
      res.json({ data, message: 'Atualização mensal encontrada' });
    } catch (error) {
      next(error);
    }
  }

  // Cria atualização mensal para o projeto especificado na rota.
  // O body contém apenas { month, year } — o projetoId vem do parâmetro de rota.
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.create(req.body, Number(req.params.projetoId));
      res.status(201).json({ data, message: 'Atualização mensal criada com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  // Remove a atualização e suas entradas financeiras (cascade via FK no banco).
  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.delete(
        Number(req.params.id),
        Number(req.params.projetoId),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
