import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

// Diálogo de confirmação para ações destrutivas ou irreversíveis.
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-white/70 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
