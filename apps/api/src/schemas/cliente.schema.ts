import { z } from 'zod';

// Schema Zod para validação dos dados de cliente recebidos via HTTP.
// O nome deve ter entre 2 e 100 caracteres conforme regra de negócio.
export const createClienteSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
});

export const updateClienteSchema = createClienteSchema.partial();

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
