import { Request, Response, NextFunction } from 'express';
import { ProjetoService } from '../services/ProjetoService';

// Controller de projetos: orquestra HTTP → service → resposta padronizada { data, message }.
export class ProjetoController {
  constructor(private readonly service: ProjetoService) {}

  async index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findAll();
      res.json({ data, message: 'Projetos recuperados com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findById(Number(req.params.id));
      res.json({ data, message: 'Projeto encontrado' });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({ data, message: 'Projeto criado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      res.json({ data, message: 'Projeto atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
