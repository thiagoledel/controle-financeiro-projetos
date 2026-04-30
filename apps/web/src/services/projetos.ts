import { api, ApiResponse } from './api';
import { Projeto, CreateProjetoDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de projetos.
export const projetosService = {
  async findAll(): Promise<Projeto[]> {
    const { data } = await api.get<ApiResponse<Projeto[]>>('/projetos');
    return data.data;
  },

  async findById(id: number): Promise<Projeto> {
    const { data } = await api.get<ApiResponse<Projeto>>(`/projetos/${id}`);
    return data.data;
  },

  async create(dto: CreateProjetoDto): Promise<Projeto> {
    const { data } = await api.post<ApiResponse<Projeto>>('/projetos', dto);
    return data.data;
  },

  async update(id: number, dto: Partial<CreateProjetoDto>): Promise<Projeto> {
    const { data } = await api.put<ApiResponse<Projeto>>(`/projetos/${id}`, dto);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projetos/${id}`);
  },
};
