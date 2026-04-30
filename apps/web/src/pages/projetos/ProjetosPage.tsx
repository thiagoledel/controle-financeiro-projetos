import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Projeto } from '@controle-financeiro/shared';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import {
  useProjetos,
  useCreateProjeto,
  useUpdateProjeto,
  useDeleteProjeto,
} from '../../hooks/useProjetos';
import { useClientes } from '../../hooks/useClientes';

const colHelper = createColumnHelper<Projeto>();

export default function ProjetosPage() {
  const navigate = useNavigate();
  const { data: projetos = [], isLoading } = useProjetos();
  const { data: clientes = [] } = useClientes();
  const createProjeto = useCreateProjeto();
  const updateProjeto = useUpdateProjeto();
  const deleteProjeto = useDeleteProjeto();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClienteId, setNewClienteId] = useState<number | ''>('');

  const [editProjeto, setEditProjeto] = useState<Projeto | null>(null);
  const [editName, setEditName] = useState('');
  const [editClienteId, setEditClienteId] = useState<number | ''>('');

  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleCreate() {
    if (!newName.trim() || !newClienteId) return;
    await createProjeto.mutateAsync({ name: newName.trim(), clienteId: Number(newClienteId) });
    setNewName('');
    setNewClienteId('');
    setCreateOpen(false);
  }

  async function handleEdit() {
    if (!editProjeto || !editName.trim() || !editClienteId) return;
    await updateProjeto.mutateAsync({
      id: editProjeto.id,
      dto: { name: editName.trim(), clienteId: Number(editClienteId) },
    });
    setEditProjeto(null);
  }

  const clienteOptions = [
    { value: '' as string | number, label: 'Selecione um cliente' },
    ...clientes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const columns = useMemo(
    () => [
      colHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className="text-white/50">#{info.getValue()}</span>,
      }),
      colHelper.accessor('name', {
        header: 'Nome',
        cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      colHelper.display({
        id: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => (
          <span className="text-white/60">{row.original.cliente?.name ?? '—'}</span>
        ),
      }),
      colHelper.display({
        id: 'acoes',
        header: 'Ações',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/projetos/${row.original.id}`)}
            >
              Detalhes
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditProjeto(row.original);
                setEditName(row.original.name);
                setEditClienteId(row.original.clienteId);
              }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDeleteId(row.original.id)}
            >
              Remover
            </Button>
          </div>
        ),
      }),
    ],
    [navigate],
  );

  const table = useReactTable({ data: projetos, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div>
      <PageHeader
        title="Projetos"
        subtitle="Gerencie os projetos cadastrados"
        actions={<Button onClick={() => setCreateOpen(true)}>+ Novo Projeto</Button>}
      />

      <DataTable table={table} isLoading={isLoading} emptyMessage="Nenhum projeto cadastrado." />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Novo Projeto">
        <div className="space-y-4 mb-4">
          <Input
            label="Nome do projeto"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex: Sistema ERP"
            className="w-full"
            autoFocus
          />
          <Select
            label="Cliente"
            value={newClienteId}
            onChange={(e) => setNewClienteId(Number(e.target.value) || '')}
            options={clienteOptions}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            isLoading={createProjeto.isPending}
            disabled={!newName.trim() || !newClienteId}
          >
            Criar
          </Button>
        </div>
      </Modal>

      <Modal isOpen={!!editProjeto} onClose={() => setEditProjeto(null)} title="Editar Projeto">
        <div className="space-y-4 mb-4">
          <Input
            label="Nome do projeto"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Ex: Sistema ERP"
            className="w-full"
            autoFocus
          />
          <Select
            label="Cliente"
            value={editClienteId}
            onChange={(e) => setEditClienteId(Number(e.target.value) || '')}
            options={clienteOptions}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEditProjeto(null)}>
            Cancelar
          </Button>
          <Button
            onClick={handleEdit}
            isLoading={updateProjeto.isPending}
            disabled={!editName.trim() || !editClienteId}
          >
            Salvar
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId !== null) {
            await deleteProjeto.mutateAsync(deleteId);
            setDeleteId(null);
          }
        }}
        title="Remover projeto"
        message="Tem certeza? Todas as atualizações mensais e entradas financeiras deste projeto serão removidas permanentemente."
        isLoading={deleteProjeto.isPending}
      />
    </div>
  );
}
