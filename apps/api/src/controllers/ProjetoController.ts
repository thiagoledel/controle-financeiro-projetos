import { Request, Response } from 'express';
import { ProjetoService } from '../services/ProjetoService';
import { asyncHandler } from '../middlewares/asyncHandler';

// Controller de projetos: orquestra HTTP → service → resposta padronizada { data, message }.
export class ProjetoController {
  constructor(private readonly service: ProjetoService) {}

  index = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.findAll();
    res.json({ data, message: 'Projetos recuperados com sucesso' });
  });

  show = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.findById(Number(req.params.id));
    res.json({ data, message: 'Projeto encontrado' });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json({ data, message: 'Projeto criado com sucesso' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(Number(req.params.id), req.body);
    res.json({ data, message: 'Projeto atualizado com sucesso' });
  });

  destroy = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(Number(req.params.id));
    res.status(204).send();
  });
}
