import { api } from './api';
import { Cliente, CreateClienteDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de clientes.
export const clientesService = {
  async findAll(): Promise<Cliente[]> {
    const { data } = await api.get<Cliente[]>('/clientes');
    return data;
  },

  async findById(id: number): Promise<Cliente> {
    const { data } = await api.get<Cliente>(`/clientes/${id}`);
    return data;
  },

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const { data } = await api.post<Cliente>('/clientes', dto);
    return data;
  },

  async update(id: number, dto: Partial<CreateClienteDto>): Promise<Cliente> {
    const { data } = await api.patch<Cliente>(`/clientes/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};
