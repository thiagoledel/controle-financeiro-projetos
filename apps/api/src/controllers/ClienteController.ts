import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/ClienteService';

// Controller de clientes: orquestra HTTP → service → resposta padronizada { data, message }.
// Nenhuma regra de negócio aqui — apenas parse de parâmetros e formatação de resposta.
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  async index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findAll();
      res.json({ data, message: 'Clientes recuperados com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.findById(Number(req.params.id));
      res.json({ data, message: 'Cliente encontrado' });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({ data, message: 'Cliente criado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      res.json({ data, message: 'Cliente atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  // DELETE retorna 204 sem corpo em caso de sucesso.
  // Em caso de projetos vinculados, o service lança AppError 409 → capturado pelo errorHandler.
  async destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
