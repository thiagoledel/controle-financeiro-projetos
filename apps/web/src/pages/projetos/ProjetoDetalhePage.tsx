import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { useProjeto } from '../../hooks/useProjetos';
import { formatCurrency, formatPercent } from '../../utils/formatters';

// Página de detalhes de um projeto: lista atualizações mensais e entradas financeiras.
export default function ProjetoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projeto, isLoading } = useProjeto(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!projeto) {
    return (
      <p className="text-center text-white/40 py-16">Projeto não encontrado.</p>
    );
  }

  return (
    <div>
      <PageHeader
        title={projeto.name}
        subtitle={`Cliente: ${projeto.cliente?.name ?? '—'}`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/projetos')}>
            ← Voltar
          </Button>
        }
      />

      <div className="grid gap-6">
        {projeto.updates?.map((update) => {
          const totalRevenue = update.entries?.reduce((sum, e) => sum + Number(e.revenue), 0) ?? 0;
          return (
            <div
              key={update.id}
              className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge
                    label={`${String(update.month).padStart(2, '0')}/${update.year}`}
                    variant="blue"
                  />
                  {totalRevenue > 0 && (
                    <span className="text-sm text-white/50">
                      Total: {formatCurrency(totalRevenue)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/30">
                  {update.entries?.length ?? 0} entrada(s)
                </span>
              </div>

              {update.entries?.length ? (
                <div className="grid gap-2">
                  {update.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-dark-900 border border-white/10 rounded-lg p-4"
                    >
                      <p className="text-white font-medium text-sm mb-2">
                        {entry.description}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-success-500">
                          {formatCurrency(Number(entry.revenue))}
                        </span>
                        <span className="text-white/50">
                          Margem: {formatPercent(Number(entry.margin))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm">
                  Nenhuma entrada financeira neste mês.
                </p>
              )}
            </div>
          );
        })}

        {!projeto.updates?.length && (
          <p className="text-center text-white/40 py-16">
            Nenhuma atualização mensal registrada para este projeto.
          </p>
        )}
      </div>
    </div>
  );
}
