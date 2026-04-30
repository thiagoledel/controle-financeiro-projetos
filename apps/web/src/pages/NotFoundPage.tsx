import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-8xl font-bold text-white/10 mb-4 leading-none">404</p>
      <h1 className="text-2xl font-semibold text-white mb-2">Página não encontrada</h1>
      <p className="text-white/50 mb-8">A rota que você acessou não existe.</p>
      <Link
        to="/clientes"
        className="px-5 py-2.5 bg-primary-700 hover:bg-primary-900 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
