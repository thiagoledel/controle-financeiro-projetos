import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/ClienteService';

// Controller de clientes: recebe a requisição HTTP, delega ao service e responde.
// Não contém regras de negócio — apenas orquestração HTTP.
const service = new ClienteService();

export class ClienteController {
  async index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientes = await service.findAll();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await service.findById(Number(req.params.id));
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await service.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cliente = await service.update(Number(req.params.id), req.body);
      res.json(cliente);
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
