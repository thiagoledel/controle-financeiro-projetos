import { Request, Response } from 'express';
import { EntradaFinanceiraService } from '../services/EntradaFinanceiraService';
import { asyncHandler } from '../middlewares/asyncHandler';

// Controller de entradas financeiras.
// Lê o atualizacaoId do parâmetro de rota :atualizacaoId
// (rota aninhada /atualizacoes/:atualizacaoId/entradas).
export class EntradaFinanceiraController {
  constructor(private readonly service: EntradaFinanceiraService) {}

  // Lista todas as entradas da atualização mensal especificada na rota.
  index = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.findByAtualizacao(Number(req.params.atualizacaoId));
    res.json({ data, message: 'Entradas financeiras recuperadas com sucesso' });
  });

  // Cria entrada financeira para a atualização mensal especificada na rota.
  // O body contém { revenue, margin, description } — o atualizacaoId vem do parâmetro de rota.
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body, Number(req.params.atualizacaoId));
    res.status(201).json({ data, message: 'Entrada financeira criada com sucesso' });
  });

  // Atualiza os campos fornecidos de uma entrada existente.
  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(
      Number(req.params.id),
      req.body,
      Number(req.params.atualizacaoId),
    );
    res.json({ data, message: 'Entrada financeira atualizada com sucesso' });
  });

  // Remove a entrada financeira; lança 404 se não existir ou não pertencer à atualização.
  destroy = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(Number(req.params.id), Number(req.params.atualizacaoId));
    res.status(204).send();
  });
}
