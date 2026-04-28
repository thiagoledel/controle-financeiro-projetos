import { z } from 'zod';

// Schema Zod para validação dos dados de projeto.
export const createProjetoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  clienteId: z.number().int().positive('clienteId deve ser um inteiro positivo'),
});

export const updateProjetoSchema = createProjetoSchema.partial();

export type CreateProjetoInput = z.infer<typeof createProjetoSchema>;
export type UpdateProjetoInput = z.infer<typeof updateProjetoSchema>;
