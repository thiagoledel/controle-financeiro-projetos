import { Request, Response } from 'express';
import { ClienteService } from '../services/ClienteService';
import { asyncHandler } from '../middlewares/asyncHandler';

// Controller de clientes: orquestra HTTP → service → resposta padronizada { data, message }.
// Nenhuma regra de negócio aqui — apenas parse de parâmetros e formatação de resposta.
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  index = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.findAll();
    res.json({ data, message: 'Clientes recuperados com sucesso' });
  });

  show = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.findById(Number(req.params.id));
    res.json({ data, message: 'Cliente encontrado' });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json({ data, message: 'Cliente criado com sucesso' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(Number(req.params.id), req.body);
    res.json({ data, message: 'Cliente atualizado com sucesso' });
  });

  // DELETE retorna 204 sem corpo em caso de sucesso.
  // Em caso de projetos vinculados, o service lança AppError 409 → capturado pelo errorHandler.
  destroy = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(Number(req.params.id));
    res.status(204).send();
  });
}
