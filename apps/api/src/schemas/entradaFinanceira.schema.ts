import { z } from 'zod';

// Schema Zod para validação de entrada financeira.
// O atualizacaoMensalId NÃO é incluído aqui — vem do parâmetro de rota :atualizacaoId.
export const createEntradaFinanceiraSchema = z.object({
  revenue: z
    .number({ required_error: 'Receita é obrigatória' })
    .positive('Receita deve ser um valor positivo'),
  margin: z
    .number({ required_error: 'Margem é obrigatória' })
    .min(0, 'Margem mínima: 0')
    .max(100, 'Margem máxima: 100'),
  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(3, 'Descrição deve ter no mínimo 3 caracteres'),
});

export const updateEntradaFinanceiraSchema = createEntradaFinanceiraSchema.partial();

export type CreateEntradaFinanceiraInput = z.infer<typeof createEntradaFinanceiraSchema>;
export type UpdateEntradaFinanceiraInput = z.infer<typeof updateEntradaFinanceiraSchema>;
