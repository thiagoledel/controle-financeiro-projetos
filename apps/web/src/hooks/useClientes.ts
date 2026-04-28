import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientesService } from '../services/clientes';
import { CreateClienteDto } from '@controle-financeiro/shared';

// Chaves de cache do TanStack Query para clientes.
export const clienteKeys = {
  all: ['clientes'] as const,
  detail: (id: number) => ['clientes', id] as const,
};

export function useClientes() {
  return useQuery({
    queryKey: clienteKeys.all,
    queryFn: clientesService.findAll,
  });
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: clienteKeys.detail(id),
    queryFn: () => clientesService.findById(id),
    enabled: !!id,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateClienteDto) => clientesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.all });
      toast.success('Cliente criado com sucesso!');
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateClienteDto> }) =>
      clientesService.update(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.all });
      queryClient.invalidateQueries({ queryKey: clienteKeys.detail(id) });
      toast.success('Cliente atualizado com sucesso!');
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.all });
      toast.success('Cliente removido com sucesso!');
    },
  });
}
