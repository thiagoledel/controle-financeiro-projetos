import { api } from './api';
import { EntradaFinanceira, CreateEntradaFinanceiraDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de entradas financeiras.
export const entradasFinanceirasService = {
  async findAll(): Promise<EntradaFinanceira[]> {
    const { data } = await api.get<EntradaFinanceira[]>('/entradas-financeiras');
    return data;
  },

  async findById(id: number): Promise<EntradaFinanceira> {
    const { data } = await api.get<EntradaFinanceira>(`/entradas-financeiras/${id}`);
    return data;
  },

  async create(
    atualizacaoMensalId: number,
    dto: CreateEntradaFinanceiraDto,
  ): Promise<EntradaFinanceira> {
    const { data } = await api.post<EntradaFinanceira>('/entradas-financeiras', {
      ...dto,
      atualizacaoMensalId,
    });
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/entradas-financeiras/${id}`);
  },
};
