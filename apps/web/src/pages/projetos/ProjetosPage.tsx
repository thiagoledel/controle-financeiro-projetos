import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Spinner } from '../../components/ui/Spinner';
import { useProjetos, useCreateProjeto, useDeleteProjeto } from '../../hooks/useProjetos';
import { useClientes } from '../../hooks/useClientes';

// Página de listagem de projetos com criação e exclusão inline.
export default function ProjetosPage() {
  const navigate = useNavigate();
  const { data: projetos, isLoading } = useProjetos();
  const { data: clientes } = useClientes();
  const createProjeto = useCreateProjeto();
  const deleteProjeto = useDeleteProjeto();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState<number | ''>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleCreate() {
    if (!newName.trim() || !selectedClienteId) return;
    await createProjeto.mutateAsync({ name: newName.trim(), clienteId: Number(selectedClienteId) });
    setNewName('');
    setSelectedClienteId('');
    setIsModalOpen(false);
  }

  const clienteOptions = [
    { value: '', label: 'Selecione um cliente' },
    ...(clientes?.map((c) => ({ value: c.id, label: c.name })) ?? []),
  ];

  return (
    <div>
      <PageHeader
        title="Projetos"
        subtitle="Gerencie os projetos cadastrados"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>+ Novo Projeto</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-3">
          {projetos?.map((projeto) => (
            <div
              key={projeto.id}
              className="bg-dark-800 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
            >
              <div>
                <p className="font-medium text-white">{projeto.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{projeto.cliente?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/projetos/${projeto.id}`)}
                >
                  Ver detalhes
                </Button>
                <Button variant="danger" onClick={() => setDeleteId(projeto.id)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
          {projetos?.length === 0 && (
            <p className="text-center text-white/40 py-16">
              Nenhum projeto cadastrado.
            </p>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
      >
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
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(Number(e.target.value) || '')}
            options={clienteOptions}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            isLoading={createProjeto.isPending}
            disabled={!newName.trim() || !selectedClienteId}
          >
            Criar
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
