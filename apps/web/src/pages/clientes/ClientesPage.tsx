import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { useClientes, useCreateCliente, useDeleteCliente } from '../../hooks/useClientes';

// Página de listagem de clientes com criação e exclusão inline.
export default function ClientesPage() {
  const navigate = useNavigate();
  const { data: clientes, isLoading } = useClientes();
  const createCliente = useCreateCliente();
  const deleteCliente = useDeleteCliente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleCreate() {
    if (!newName.trim()) return;
    await createCliente.mutateAsync({ name: newName.trim() });
    setNewName('');
    setIsModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie os clientes cadastrados"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>+ Novo Cliente</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-3">
          {clientes?.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
            >
              <div>
                <p className="font-medium text-white">{cliente.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {cliente.projects?.length ?? 0} projeto(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/clientes/${cliente.id}`)}
                >
                  Ver detalhes
                </Button>
                <Button variant="danger" onClick={() => setDeleteId(cliente.id)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
          {clientes?.length === 0 && (
            <p className="text-center text-white/40 py-16">
              Nenhum cliente cadastrado.
            </p>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Cliente"
      >
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
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} isLoading={createCliente.isPending}>
            Criar
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
