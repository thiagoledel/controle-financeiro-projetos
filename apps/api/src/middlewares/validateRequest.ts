import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError';

// Middleware de validação de entrada com Zod.
// Substitui req.body pelo valor parseado (com tipagem garantida).
// Retorna 422 com detalhes dos campos inválidos caso a validação falhe.
export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        next(new AppError(`Dados inválidos: ${messages}`, 422));
      } else {
        next(error);
      }
    }
  };
}
