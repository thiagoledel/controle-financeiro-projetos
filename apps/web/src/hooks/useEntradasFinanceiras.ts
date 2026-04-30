import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { entradasFinanceirasService } from '../services/entradasFinanceiras';
import { CreateEntradaFinanceiraDto } from '@controle-financeiro/shared';
import { atualizacaoKeys } from './useAtualizacoesMensais';

// Hooks de mutations para entradas financeiras.
// Após cada operação, invalida o cache de atualizações do projeto
// para que a lista de entradas dentro de cada card seja atualizada.

// Cria uma entrada financeira para a atualização mensal informada.
export function useCreateEntrada(projetoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      atualizacaoId,
      dto,
    }: {
      atualizacaoId: number;
      dto: CreateEntradaFinanceiraDto;
    }) => entradasFinanceirasService.create(atualizacaoId, dto),
    onSuccess: () => {
      // Invalida as atualizações do projeto para refletir a nova entrada na tabela.
      queryClient.invalidateQueries({ queryKey: atualizacaoKeys.byProjeto(projetoId) });
      toast.success('Entrada financeira criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Atualiza uma entrada financeira existente.
export function useUpdateEntrada(projetoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      atualizacaoId,
      id,
      dto,
    }: {
      atualizacaoId: number;
      id: number;
      dto: Partial<CreateEntradaFinanceiraDto>;
    }) => entradasFinanceirasService.update(atualizacaoId, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atualizacaoKeys.byProjeto(projetoId) });
      toast.success('Entrada financeira atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Remove uma entrada financeira da atualização mensal.
export function useDeleteEntrada(projetoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ atualizacaoId, id }: { atualizacaoId: number; id: number }) =>
      entradasFinanceirasService.delete(atualizacaoId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: atualizacaoKeys.byProjeto(projetoId) });
      toast.success('Entrada financeira removida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
