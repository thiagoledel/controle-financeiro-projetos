import { api, ApiResponse } from './api';
import { AtualizacaoMensal, CreateAtualizacaoMensalDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de atualizações mensais.
// As rotas são aninhadas sob /projetos/:projetoId/atualizacoes conforme arquitetura REST.
export const atualizacoesMensaisService = {
  // Retorna todas as atualizações de um projeto (com entradas incluídas).
  async findByProjeto(projetoId: number): Promise<AtualizacaoMensal[]> {
    const { data } = await api.get<ApiResponse<AtualizacaoMensal[]>>(
      `/projetos/${projetoId}/atualizacoes`,
    );
    return data.data;
  },

  // Busca atualização por ID verificando pertencimento ao projeto.
  async findById(projetoId: number, id: number): Promise<AtualizacaoMensal> {
    const { data } = await api.get<ApiResponse<AtualizacaoMensal>>(
      `/projetos/${projetoId}/atualizacoes/${id}`,
    );
    return data.data;
  },

  // Cria atualização mensal para o projeto.
  // O projetoId vai na URL; o body contém apenas { month, year }.
  async create(projetoId: number, dto: CreateAtualizacaoMensalDto): Promise<AtualizacaoMensal> {
    const { data } = await api.post<ApiResponse<AtualizacaoMensal>>(
      `/projetos/${projetoId}/atualizacoes`,
      dto,
    );
    return data.data;
  },

  // Remove a atualização e todas as entradas financeiras em cascade.
  async delete(projetoId: number, id: number): Promise<void> {
    await api.delete(`/projetos/${projetoId}/atualizacoes/${id}`);
  },
};
