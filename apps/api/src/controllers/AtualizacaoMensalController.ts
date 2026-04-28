import { Request, Response, NextFunction } from 'express';
import { AtualizacaoMensalService } from '../services/AtualizacaoMensalService';

// Controller de atualizações mensais.
const service = new AtualizacaoMensalService();

export class AtualizacaoMensalController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Permite filtrar pelo projetoId via query string: /atualizacoes-mensais?projetoId=1
      if (req.query.projetoId) {
        const atualizacoes = await service.findByProjeto(Number(req.query.projetoId));
        res.json(atualizacoes);
        return;
      }
      const atualizacoes = await service.findAll();
      res.json(atualizacoes);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const atualizacao = await service.findById(Number(req.params.id));
      res.json(atualizacao);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const atualizacao = await service.create(req.body);
      res.status(201).json(atualizacao);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const atualizacao = await service.update(Number(req.params.id), req.body);
      res.json(atualizacao);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
