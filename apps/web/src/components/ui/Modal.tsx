import { ReactNode, useEffect, useRef } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Modal com overlay semitransparente.
// Acessibilidade: captura foco ao abrir, restaura ao fechar, fecha com ESC ou clique no overlay.
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Guarda o elemento focado antes de abrir o modal para restaurar ao fechar.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Fecha o modal ao pressionar ESC.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Gerencia o foco: captura ao abrir e restaura ao fechar.
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Usa setTimeout para garantir que o DOM já renderizou o modal antes de focar.
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay: clicar fora fecha o modal */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-dark-800 rounded-xl border border-white/10 p-6 w-full max-w-md shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar modal"
            className="!px-2 !py-1 text-lg leading-none"
          >
            ×
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
