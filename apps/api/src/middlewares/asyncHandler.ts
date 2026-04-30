import { Request, Response, NextFunction, RequestHandler } from 'express';

// Elimina try/catch repetitivo nos controllers: captura qualquer rejeição da função
// assíncrona e delega ao próximo middleware de erro via next(err).
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
