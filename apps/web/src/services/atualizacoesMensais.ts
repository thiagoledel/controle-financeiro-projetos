import { api } from './api';
import { AtualizacaoMensal, CreateAtualizacaoMensalDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de atualizações mensais.
export const atualizacoesMensaisService = {
  async findAll(): Promise<AtualizacaoMensal[]> {
    const { data } = await api.get<AtualizacaoMensal[]>('/atualizacoes-mensais');
    return data;
  },

  async findById(id: number): Promise<AtualizacaoMensal> {
    const { data } = await api.get<AtualizacaoMensal>(`/atualizacoes-mensais/${id}`);
    return data;
  },

  async findByProjeto(projetoId: number): Promise<AtualizacaoMensal[]> {
    const { data } = await api.get<AtualizacaoMensal[]>('/atualizacoes-mensais', {
      params: { projetoId },
    });
    return data;
  },

  async create(projetoId: number, dto: CreateAtualizacaoMensalDto): Promise<AtualizacaoMensal> {
    const { data } = await api.post<AtualizacaoMensal>('/atualizacoes-mensais', {
      ...dto,
      projetoId,
    });
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/atualizacoes-mensais/${id}`);
  },
};
