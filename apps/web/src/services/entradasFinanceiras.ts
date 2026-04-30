import { api, ApiResponse } from './api';
import { EntradaFinanceira, CreateEntradaFinanceiraDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de entradas financeiras.
// As rotas são aninhadas sob /atualizacoes/:atualizacaoId/entradas.
export const entradasFinanceirasService = {
  // Retorna todas as entradas de uma atualização mensal.
  async findByAtualizacao(atualizacaoId: number): Promise<EntradaFinanceira[]> {
    const { data } = await api.get<ApiResponse<EntradaFinanceira[]>>(
      `/atualizacoes/${atualizacaoId}/entradas`,
    );
    return data.data;
  },

  // Cria entrada financeira para a atualização mensal.
  // O atualizacaoId vai na URL; o body contém { revenue, margin, description }.
  async create(
    atualizacaoId: number,
    dto: CreateEntradaFinanceiraDto,
  ): Promise<EntradaFinanceira> {
    const { data } = await api.post<ApiResponse<EntradaFinanceira>>(
      `/atualizacoes/${atualizacaoId}/entradas`,
      dto,
    );
    return data.data;
  },

  // Atualiza campos de uma entrada financeira existente.
  async update(
    atualizacaoId: number,
    id: number,
    dto: Partial<CreateEntradaFinanceiraDto>,
  ): Promise<EntradaFinanceira> {
    const { data } = await api.put<ApiResponse<EntradaFinanceira>>(
      `/atualizacoes/${atualizacaoId}/entradas/${id}`,
      dto,
    );
    return data.data;
  },

  async delete(atualizacaoId: number, id: number): Promise<void> {
    await api.delete(`/atualizacoes/${atualizacaoId}/entradas/${id}`);
  },
};
