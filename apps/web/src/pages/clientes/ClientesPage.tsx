import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Cliente } from '@controle-financeiro/shared';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import {
  useClientes,
  useCreateCliente,
  useUpdateCliente,
  useDeleteCliente,
} from '../../hooks/useClientes';

const colHelper = createColumnHelper<Cliente>();

export default function ClientesPage() {
  const navigate = useNavigate();
  const { data: clientes = [], isLoading } = useClientes();
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();
  const deleteCliente = useDeleteCliente();

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [editName, setEditName] = useState('');

  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleCreate() {
    if (!newName.trim()) return;
    await createCliente.mutateAsync({ name: newName.trim() });
    setNewName('');
    setCreateOpen(false);
  }

  async function handleEdit() {
    if (!editCliente || !editName.trim()) return;
    await updateCliente.mutateAsync({ id: editCliente.id, dto: { name: editName.trim() } });
    setEditCliente(null);
  }

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
        id: 'projetos',
        header: 'Qtd. Projetos',
        cell: ({ row }) => (
          <span className="text-white/60">{row.original.projects?.length ?? 0}</span>
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
              onClick={() => navigate(`/clientes/${row.original.id}`)}
            >
              Detalhes
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditCliente(row.original);
                setEditName(row.original.name);
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

  const table = useReactTable({ data: clientes, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie os clientes cadastrados"
        actions={<Button onClick={() => setCreateOpen(true)}>+ Novo Cliente</Button>}
      />

      <DataTable table={table} isLoading={isLoading} emptyMessage="Nenhum cliente cadastrado." />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Novo Cliente">
        <Input
          label="Nome do cliente"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Ex: Empresa XPTO"
          className="w-full mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} isLoading={createCliente.isPending} disabled={!newName.trim()}>
            Criar
          </Button>
        </div>
      </Modal>

      <Modal isOpen={!!editCliente} onClose={() => setEditCliente(null)} title="Editar Cliente">
        <Input
          label="Nome do cliente"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          placeholder="Ex: Empresa XPTO"
          className="w-full mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEditCliente(null)}>
            Cancelar
          </Button>
          <Button onClick={handleEdit} isLoading={updateCliente.isPending} disabled={!editName.trim()}>
            Salvar
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId !== null) {
            await deleteCliente.mutateAsync(deleteId);
            setDeleteId(null);
          }
        }}
        title="Remover cliente"
        message="Tem certeza? Todos os projetos e dados financeiros associados serão removidos permanentemente."
        isLoading={deleteCliente.isPending}
      />
    </div>
  );
}
