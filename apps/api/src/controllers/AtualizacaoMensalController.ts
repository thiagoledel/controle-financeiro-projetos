import { Request, Response } from 'express';
import { AtualizacaoMensalService } from '../services/AtualizacaoMensalService';
import { asyncHandler } from '../middlewares/asyncHandler';

// Controller de atualizações mensais.
// Lê o projetoId do parâmetro de rota :projetoId (rota aninhada /projetos/:projetoId/atualizacoes).
export class AtualizacaoMensalController {
  constructor(private readonly service: AtualizacaoMensalService) {}

  // Lista todas as atualizações do projeto especificado na rota.
  index = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.findByProjeto(Number(req.params.projetoId));
    res.json({ data, message: 'Atualizações mensais recuperadas com sucesso' });
  });

  // Busca atualização por ID verificando que pertence ao projeto da rota.
  show = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.findByIdAndProjeto(
      Number(req.params.id),
      Number(req.params.projetoId),
    );
    res.json({ data, message: 'Atualização mensal encontrada' });
  });

  // Cria atualização mensal para o projeto especificado na rota.
  // O body contém apenas { month, year } — o projetoId vem do parâmetro de rota.
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body, Number(req.params.projetoId));
    res.status(201).json({ data, message: 'Atualização mensal criada com sucesso' });
  });

  // Remove a atualização e suas entradas financeiras (cascade via FK no banco).
  destroy = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(
      Number(req.params.id),
      Number(req.params.projetoId),
    );
    res.status(204).send();
  });
}
