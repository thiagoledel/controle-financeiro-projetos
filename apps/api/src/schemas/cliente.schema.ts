import { z } from 'zod';

// Schema Zod para validação dos dados de cliente recebidos via HTTP.
export const createClienteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
});

export const updateClienteSchema = createClienteSchema.partial();

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
