import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useCliente } from '../../hooks/useClientes';

export default function ClienteDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, isLoading } = useCliente(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!cliente) {
    return <p className="text-center text-white/40 py-16">Cliente não encontrado.</p>;
  }

  return (
    <div>
      <PageHeader
        title={cliente.name}
        subtitle={`${cliente.projects?.length ?? 0} projeto(s) vinculado(s)`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/clientes')}>
            ← Voltar
          </Button>
        }
      />

      <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Projetos vinculados</h2>

        {!cliente.projects?.length ? (
          <p className="text-white/40 text-sm">Nenhum projeto vinculado a este cliente.</p>
        ) : (
          <div className="grid gap-3">
            {cliente.projects.map((projeto) => (
              <Link
                key={projeto.id}
                to={`/projetos/${projeto.id}`}
                className="bg-dark-900 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-white/20 hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{projeto.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">#{projeto.id}</p>
                </div>
                <span className="text-white/40 text-sm">Ver →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
