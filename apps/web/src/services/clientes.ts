import { api, ApiResponse } from './api';
import { Cliente, CreateClienteDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de clientes.
// Todas as respostas de sucesso são envoltas em ApiResponse<T> pelo backend.
export const clientesService = {
  async findAll(): Promise<Cliente[]> {
    const { data } = await api.get<ApiResponse<Cliente[]>>('/clientes');
    return data.data;
  },

  async findById(id: number): Promise<Cliente> {
    const { data } = await api.get<ApiResponse<Cliente>>(`/clientes/${id}`);
    return data.data;
  },

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const { data } = await api.post<ApiResponse<Cliente>>('/clientes', dto);
    return data.data;
  },

  // PUT em vez de PATCH: a API aceita substituição parcial via PUT conforme convenção do projeto.
  async update(id: number, dto: Partial<CreateClienteDto>): Promise<Cliente> {
    const { data } = await api.put<ApiResponse<Cliente>>(`/clientes/${id}`, dto);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};
