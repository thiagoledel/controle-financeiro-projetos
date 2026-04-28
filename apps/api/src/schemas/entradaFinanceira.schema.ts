import { z } from 'zod';

// Schema Zod para validação de entrada financeira.
export const createEntradaFinanceiraSchema = z.object({
  atualizacaoMensalId: z.number().int().positive('atualizacaoMensalId deve ser um inteiro positivo'),
  revenue: z.number().positive('Receita deve ser um valor positivo'),
  margin: z.number().min(0, 'Margem mínima: 0').max(100, 'Margem máxima: 100'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

export const updateEntradaFinanceiraSchema = createEntradaFinanceiraSchema.partial();

export type CreateEntradaFinanceiraInput = z.infer<typeof createEntradaFinanceiraSchema>;
export type UpdateEntradaFinanceiraInput = z.infer<typeof updateEntradaFinanceiraSchema>;
