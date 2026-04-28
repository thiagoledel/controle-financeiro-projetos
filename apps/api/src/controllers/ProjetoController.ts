import { Request, Response, NextFunction } from 'express';
import { ProjetoService } from '../services/ProjetoService';

// Controller de projetos.
const service = new ProjetoService();

export class ProjetoController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projetos = await service.findAll();
      res.json(projetos);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projeto = await service.findById(Number(req.params.id));
      res.json(projeto);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projeto = await service.create(req.body);
      res.status(201).json(projeto);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projeto = await service.update(Number(req.params.id), req.body);
      res.json(projeto);
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
