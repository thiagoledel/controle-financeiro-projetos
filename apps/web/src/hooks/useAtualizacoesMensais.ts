import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { atualizacoesMensaisService } from '../services/atualizacoesMensais';
import { CreateAtualizacaoMensalDto } from '@controle-financeiro/shared';

// Chaves de cache do TanStack Query para atualizações mensais.
// A chave inclui o projetoId para isolamento de cache por projeto.
export const atualizacaoKeys = {
  byProjeto: (projetoId: number) => ['atualizacoes', projetoId] as const,
};

// Retorna as atualizações mensais de um projeto com suas entradas financeiras incluídas.
export function useAtualizacoes(projetoId: number) {
  return useQuery({
    queryKey: atualizacaoKeys.byProjeto(projetoId),
    queryFn: () => atualizacoesMensaisService.findByProjeto(projetoId),
    enabled: !!projetoId,
  });
}

// Cria uma nova atualização mensal para o projeto e invalida o cache da lista.
export function useCreateAtualizacao(projetoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAtualizacaoMensalDto) =>
      atualizacoesMensaisService.create(projetoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atualizacaoKeys.byProjeto(projetoId) });
      toast.success('Atualização mensal criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Remove a atualização mensal e suas entradas em cascade.
export function useDeleteAtualizacao(projetoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => atualizacoesMensaisService.delete(projetoId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atualizacaoKeys.byProjeto(projetoId) });
      toast.success('Atualização mensal removida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
