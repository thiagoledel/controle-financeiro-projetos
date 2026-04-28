import { z } from 'zod';

// Schema Zod para validação de atualização mensal.
export const createAtualizacaoMensalSchema = z.object({
  projetoId: z.number().int().positive('projetoId deve ser um inteiro positivo'),
  month: z.number().int().min(1, 'Mês mínimo: 1').max(12, 'Mês máximo: 12'),
  year: z.number().int().min(2000, 'Ano deve ser >= 2000'),
});

export const updateAtualizacaoMensalSchema = createAtualizacaoMensalSchema.partial();

export type CreateAtualizacaoMensalInput = z.infer<typeof createAtualizacaoMensalSchema>;
export type UpdateAtualizacaoMensalInput = z.infer<typeof updateAtualizacaoMensalSchema>;
