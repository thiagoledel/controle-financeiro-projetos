import { z } from 'zod';

// Schema Zod para validação dos dados de projeto.
// O clienteId é obrigatório no body porque projetos são criados fora do contexto aninhado.
export const createProjetoSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  clienteId: z
    .number({ required_error: 'clienteId é obrigatório' })
    .int('clienteId deve ser um inteiro')
    .positive('clienteId deve ser positivo'),
});

export const updateProjetoSchema = createProjetoSchema.partial();

export type CreateProjetoInput = z.infer<typeof createProjetoSchema>;
export type UpdateProjetoInput = z.infer<typeof updateProjetoSchema>;
