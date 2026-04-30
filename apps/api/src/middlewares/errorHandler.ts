import { Request, Response, NextFunction } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';

// Interface interna para acessar o código de erro do driver PostgreSQL sem usar `any`.
interface PostgresDriverError {
  code: string;
}

// Middleware global de tratamento de erros — deve ser o último middleware registrado.
// Classifica o erro recebido e retorna a resposta HTTP adequada com formato padronizado.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Erro operacional lançado pela aplicação (negócio ou validação).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, statusCode: err.statusCode },
    });
    return;
  }

  // Erros de query do TypeORM: mapeia códigos PostgreSQL para status HTTP semânticos.
  if (err instanceof QueryFailedError) {
    const driver = (err as unknown as { driverError: PostgresDriverError }).driverError;

    // 23505 = unique_violation: registro duplicado (ex: mês/ano já existe para o projeto).
    if (driver?.code === '23505') {
      res.status(409).json({
        error: { message: 'Registro duplicado', statusCode: 409 },
      });
      return;
    }

    // 23503 = foreign_key_violation: entidade pai não existe ou possui filhos vinculados.
    if (driver?.code === '23503') {
      res.status(409).json({
        error: { message: 'Violação de chave estrangeira', statusCode: 409 },
      });
      return;
    }
  }

  // EntityNotFoundError: lançado pelo TypeORM ao usar findOneOrFail/findOneByOrFail.
  if (err instanceof EntityNotFoundError) {
    res.status(404).json({
      error: { message: 'Registro não encontrado', statusCode: 404 },
    });
    return;
  }

  // Erro inesperado: registra detalhes no logger e retorna mensagem genérica ao cliente.
  logger.error({ err }, 'Erro interno não tratado');
  res.status(500).json({
    error: { message: 'Erro interno do servidor', statusCode: 500 },
  });
}
