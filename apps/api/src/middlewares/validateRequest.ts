import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Middleware de validação de entrada com Zod.
// Recebe um schema Zod, valida req.body e substitui pelo valor parseado (tipagem garantida).
// Retorna 400 com a lista detalhada de campos inválidos caso a validação falhe.
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata cada erro Zod como { field, message } para facilitar o debug pelo cliente.
        const details = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        res.status(400).json({
          error: { message: 'Dados de entrada inválidos', statusCode: 400, details },
        });
        return;
      }
      next(error);
    }
  };
}
