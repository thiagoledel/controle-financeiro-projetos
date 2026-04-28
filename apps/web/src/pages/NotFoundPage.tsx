import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Página de erro 404 — rota não encontrada pelo React Router.
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-7xl font-bold text-white/10">404</h1>
      <p className="text-white/50">Página não encontrada</p>
      <Button onClick={() => navigate('/')}>Ir para o início</Button>
    </div>
  );
}
