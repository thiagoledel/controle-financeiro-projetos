import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useCliente } from '../../hooks/useClientes';

// Página de detalhes de um cliente: exibe os projetos vinculados.
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
    return (
      <p className="text-center text-white/40 py-16">Cliente não encontrado.</p>
    );
  }

  return (
    <div>
      <PageHeader
        title={cliente.name}
        subtitle="Detalhes do cliente"
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
              <div
                key={projeto.id}
                className="bg-dark-900 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/projetos/${projeto.id}`)}
              >
                <p className="font-medium text-white">{projeto.name}</p>
                <span className="text-white/40 text-sm">Ver →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
