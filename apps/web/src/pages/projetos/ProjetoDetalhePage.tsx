import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AtualizacaoMensal, EntradaFinanceira } from '@controle-financeiro/shared';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import { Spinner } from '../../components/ui/Spinner';
import { useProjeto } from '../../hooks/useProjetos';
import {
  useAtualizacoes,
  useCreateAtualizacao,
  useDeleteAtualizacao,
} from '../../hooks/useAtualizacoesMensais';
import {
  useCreateEntrada,
  useUpdateEntrada,
  useDeleteEntrada,
} from '../../hooks/useEntradasFinanceiras';
import { formatCurrency, formatPercent, formatMonth } from '../../utils/formatters';

const entradaCol = createColumnHelper<EntradaFinanceira>();

const MONTH_OPTIONS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

// Sub-componente para cada bloco mensal com sua própria instância do TanStack Table.
function MonthSection({
  atualizacao,
  onAddEntrada,
  onEditEntrada,
  onDeleteEntrada,
  onDeleteAtualizacao,
}: {
  atualizacao: AtualizacaoMensal;
  onAddEntrada: (id: number) => void;
  onEditEntrada: (entrada: EntradaFinanceira, atualizacaoId: number) => void;
  onDeleteEntrada: (atualizacaoId: number, entradaId: number) => void;
  onDeleteAtualizacao: (id: number) => void;
}) {
  const entries = atualizacao.entries ?? [];
  const totalRevenue = entries.reduce((sum, e) => sum + Number(e.revenue), 0);

  const columns = [
    entradaCol.accessor('description', {
      header: 'Descrição',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    entradaCol.accessor('revenue', {
      header: 'Receita',
      cell: (info) => (
        <span className="text-success-500 font-medium">
          {formatCurrency(Number(info.getValue()))}
        </span>
      ),
    }),
    entradaCol.accessor('margin', {
      header: 'Margem',
      cell: (info) => (
        <span className="text-white/60">{formatPercent(Number(info.getValue()))}</span>
      ),
    }),
    entradaCol.display({
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEditEntrada(row.original, atualizacao.id)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDeleteEntrada(atualizacao.id, row.original.id)}
          >
            Remover
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({ data: entries, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge
            label={`${formatMonth(atualizacao.month)} / ${atualizacao.year}`}
            variant="blue"
          />
          {totalRevenue > 0 && (
            <span className="text-sm text-white/50">Total: {formatCurrency(totalRevenue)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onAddEntrada(atualizacao.id)}>
            + Entrada
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDeleteAtualizacao(atualizacao.id)}>
            Remover mês
          </Button>
        </div>
      </div>
      <DataTable table={table} emptyMessage="Nenhuma entrada financeira neste mês." />
    </div>
  );
}

type EntradaComAtualizacaoId = EntradaFinanceira & { atualizacaoId: number };

export default function ProjetoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const projetoId = Number(id);
  const navigate = useNavigate();

  const { data: projeto, isLoading: loadingProjeto } = useProjeto(projetoId);
  const { data: atualizacoes = [], isLoading: loadingAtualizacoes } = useAtualizacoes(projetoId);

  const createAtualizacao = useCreateAtualizacao(projetoId);
  const deleteAtualizacao = useDeleteAtualizacao(projetoId);
  const createEntrada = useCreateEntrada(projetoId);
  const updateEntrada = useUpdateEntrada(projetoId);
  const deleteEntrada = useDeleteEntrada(projetoId);

  // Modal: nova atualização
  const [novaAtaOpen, setNovaAtaOpen] = useState(false);
  const [ataMonth, setAtaMonth] = useState<number>(new Date().getMonth() + 1);
  const [ataYear, setAtaYear] = useState<string>(String(new Date().getFullYear()));

  // Modal: adicionar entrada
  const [addEntradaId, setAddEntradaId] = useState<number | null>(null);
  const [newRevenue, setNewRevenue] = useState('');
  const [newMargin, setNewMargin] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Modal: editar entrada
  const [editEntrada, setEditEntrada] = useState<EntradaComAtualizacaoId | null>(null);
  const [editRevenue, setEditRevenue] = useState('');
  const [editMargin, setEditMargin] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Confirmações
  const [deleteAtaId, setDeleteAtaId] = useState<number | null>(null);
  const [deleteEntradaTarget, setDeleteEntradaTarget] = useState<{
    atualizacaoId: number;
    id: number;
  } | null>(null);

  function openEditEntrada(entrada: EntradaFinanceira, atualizacaoId: number) {
    setEditEntrada({ ...entrada, atualizacaoId });
    setEditRevenue(String(entrada.revenue));
    setEditMargin(String(entrada.margin));
    setEditDescription(entrada.description);
  }

  function closeNovaAta() {
    setNovaAtaOpen(false);
    setAtaMonth(new Date().getMonth() + 1);
    setAtaYear(String(new Date().getFullYear()));
  }

  function closeAddEntrada() {
    setAddEntradaId(null);
    setNewRevenue('');
    setNewMargin('');
    setNewDescription('');
  }

  async function handleCreateAtualizacao() {
    const year = Number(ataYear);
    if (!year) return;
    await createAtualizacao.mutateAsync({ month: ataMonth, year });
    closeNovaAta();
  }

  async function handleCreateEntrada() {
    if (!addEntradaId) return;
    await createEntrada.mutateAsync({
      atualizacaoId: addEntradaId,
      dto: {
        revenue: Number(newRevenue),
        margin: Number(newMargin),
        description: newDescription.trim(),
      },
    });
    closeAddEntrada();
  }

  async function handleUpdateEntrada() {
    if (!editEntrada) return;
    await updateEntrada.mutateAsync({
      atualizacaoId: editEntrada.atualizacaoId,
      id: editEntrada.id,
      dto: {
        revenue: Number(editRevenue),
        margin: Number(editMargin),
        description: editDescription.trim(),
      },
    });
    setEditEntrada(null);
  }

  if (loadingProjeto) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!projeto) {
    return <p className="text-center text-white/40 py-16">Projeto não encontrado.</p>;
  }

  return (
    <div>
      <PageHeader
        title={projeto.name}
        subtitle={`Cliente: ${projeto.cliente?.name ?? '—'}`}
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/projetos')}>
              ← Voltar
            </Button>
            <Button onClick={() => setNovaAtaOpen(true)}>+ Nova Atualização</Button>
          </div>
        }
      />

      {loadingAtualizacoes ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : atualizacoes.length === 0 ? (
        <p className="text-center text-white/40 py-16">
          Nenhuma atualização mensal registrada para este projeto.
        </p>
      ) : (
        <div className="grid gap-6">
          {atualizacoes.map((ata) => (
            <MonthSection
              key={ata.id}
              atualizacao={ata}
              onAddEntrada={setAddEntradaId}
              onEditEntrada={openEditEntrada}
              onDeleteEntrada={(atualizacaoId, entradaId) =>
                setDeleteEntradaTarget({ atualizacaoId, id: entradaId })
              }
              onDeleteAtualizacao={setDeleteAtaId}
            />
          ))}
        </div>
      )}

      {/* Modal: nova atualização mensal */}
      <Modal isOpen={novaAtaOpen} onClose={closeNovaAta} title="Nova Atualização Mensal">
        <div className="space-y-4 mb-4">
          <Select
            label="Mês"
            value={ataMonth}
            onChange={(e) => setAtaMonth(Number(e.target.value))}
            options={MONTH_OPTIONS}
            className="w-full"
          />
          <Input
            label="Ano"
            type="number"
            value={ataYear}
            onChange={(e) => setAtaYear(e.target.value)}
            min={2000}
            max={2100}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeNovaAta}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateAtualizacao}
            isLoading={createAtualizacao.isPending}
            disabled={!ataYear}
          >
            Criar
          </Button>
        </div>
      </Modal>

      {/* Modal: adicionar entrada financeira */}
      <Modal
        isOpen={addEntradaId !== null}
        onClose={closeAddEntrada}
        title="Adicionar Entrada Financeira"
      >
        <div className="space-y-4 mb-4">
          <Input
            label="Descrição"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Ex: Consultoria técnica"
            className="w-full"
            autoFocus
          />
          <Input
            label="Receita (R$)"
            type="number"
            value={newRevenue}
            onChange={(e) => setNewRevenue(e.target.value)}
            placeholder="Ex: 15000"
            min={0}
            step={0.01}
            className="w-full"
          />
          <Input
            label="Margem (%)"
            type="number"
            value={newMargin}
            onChange={(e) => setNewMargin(e.target.value)}
            placeholder="Ex: 35.5"
            min={0}
            max={100}
            step={0.01}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeAddEntrada}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateEntrada}
            isLoading={createEntrada.isPending}
            disabled={!newDescription.trim() || !newRevenue || !newMargin}
          >
            Adicionar
          </Button>
        </div>
      </Modal>

      {/* Modal: editar entrada financeira */}
      <Modal
        isOpen={!!editEntrada}
        onClose={() => setEditEntrada(null)}
        title="Editar Entrada Financeira"
      >
        <div className="space-y-4 mb-4">
          <Input
            label="Descrição"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Ex: Consultoria técnica"
            className="w-full"
            autoFocus
          />
          <Input
            label="Receita (R$)"
            type="number"
            value={editRevenue}
            onChange={(e) => setEditRevenue(e.target.value)}
            min={0}
            step={0.01}
            className="w-full"
          />
          <Input
            label="Margem (%)"
            type="number"
            value={editMargin}
            onChange={(e) => setEditMargin(e.target.value)}
            min={0}
            max={100}
            step={0.01}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEditEntrada(null)}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateEntrada}
            isLoading={updateEntrada.isPending}
            disabled={!editDescription.trim() || !editRevenue || !editMargin}
          >
            Salvar
          </Button>
        </div>
      </Modal>

      {/* Confirmação: remover atualização mensal */}
      <ConfirmDialog
        isOpen={deleteAtaId !== null}
        onClose={() => setDeleteAtaId(null)}
        onConfirm={async () => {
          if (deleteAtaId !== null) {
            await deleteAtualizacao.mutateAsync(deleteAtaId);
            setDeleteAtaId(null);
          }
        }}
        title="Remover atualização mensal"
        message="Tem certeza? Todas as entradas financeiras deste mês serão removidas permanentemente."
        isLoading={deleteAtualizacao.isPending}
      />

      {/* Confirmação: remover entrada financeira */}
      <ConfirmDialog
        isOpen={deleteEntradaTarget !== null}
        onClose={() => setDeleteEntradaTarget(null)}
        onConfirm={async () => {
          if (deleteEntradaTarget !== null) {
            await deleteEntrada.mutateAsync(deleteEntradaTarget);
            setDeleteEntradaTarget(null);
          }
        }}
        title="Remover entrada financeira"
        message="Tem certeza? Esta entrada financeira será removida permanentemente."
        isLoading={deleteEntrada.isPending}
      />
    </div>
  );
}
