import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projetosService } from '../services/projetos';
import { CreateProjetoDto } from '@controle-financeiro/shared';

// Chaves de cache do TanStack Query para projetos.
export const projetoKeys = {
  all: ['projetos'] as const,
  detail: (id: number) => ['projetos', id] as const,
};

export function useProjetos() {
  return useQuery({
    queryKey: projetoKeys.all,
    queryFn: projetosService.findAll,
  });
}

export function useProjeto(id: number) {
  return useQuery({
    queryKey: projetoKeys.detail(id),
    queryFn: () => projetosService.findById(id),
    enabled: !!id,
  });
}

export function useCreateProjeto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProjetoDto) => projetosService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetoKeys.all });
      toast.success('Projeto criado com sucesso!');
    },
  });
}

export function useDeleteProjeto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projetosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projetoKeys.all });
      toast.success('Projeto removido com sucesso!');
    },
  });
}
