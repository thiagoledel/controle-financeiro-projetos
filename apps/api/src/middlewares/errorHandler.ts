import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Middleware global de tratamento de erros.
// Deve ser o último middleware registrado no Express.
// Distingue erros operacionais (AppError) de erros inesperados (500).
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
