import { Request, Response, NextFunction } from 'express';
import { EntradaFinanceiraService } from '../services/EntradaFinanceiraService';

// Controller de entradas financeiras.
const service = new EntradaFinanceiraService();

export class EntradaFinanceiraController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Permite filtrar pela atualização mensal: /entradas-financeiras?atualizacaoMensalId=1
      if (req.query.atualizacaoMensalId) {
        const entradas = await service.findByAtualizacaoMensal(Number(req.query.atualizacaoMensalId));
        res.json(entradas);
        return;
      }
      const entradas = await service.findAll();
      res.json(entradas);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entrada = await service.findById(Number(req.params.id));
      res.json(entrada);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entrada = await service.create(req.body);
      res.status(201).json(entrada);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entrada = await service.update(Number(req.params.id), req.body);
      res.json(entrada);
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
