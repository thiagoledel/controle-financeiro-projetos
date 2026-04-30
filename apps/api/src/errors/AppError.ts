// Classe de erro customizada para erros de negócio e validação HTTP.
// Permite distinguir falhas operacionais (esperadas) de erros inesperados do sistema.
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    // Restaura o prototype correto ao extender Error no TypeScript compilado para ES5.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
