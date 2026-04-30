import { z } from 'zod';

// Schema Zod para criação de atualização mensal.
// O projetoId NÃO é incluído aqui — ele vem do parâmetro de rota :projetoId.
// Isso evita ambiguidade entre o corpo da requisição e o contexto da URL.
export const createAtualizacaoMensalSchema = z.object({
  month: z
    .number({ required_error: 'Mês é obrigatório' })
    .int('Mês deve ser inteiro')
    .min(1, 'Mês mínimo: 1')
    .max(12, 'Mês máximo: 12'),
  year: z
    .number({ required_error: 'Ano é obrigatório' })
    .int('Ano deve ser inteiro')
    .min(2000, 'Ano deve ser >= 2000')
    .max(2100, 'Ano deve ser <= 2100'),
});

// Partial para eventuais atualizações futuras — mantido por consistência com demais schemas.
export const updateAtualizacaoMensalSchema = createAtualizacaoMensalSchema.partial();

export type CreateAtualizacaoMensalInput = z.infer<typeof createAtualizacaoMensalSchema>;
export type UpdateAtualizacaoMensalInput = z.infer<typeof updateAtualizacaoMensalSchema>;
