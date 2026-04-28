import { api } from './api';
import { Projeto, CreateProjetoDto } from '@controle-financeiro/shared';

// Funções de acesso à API REST de projetos.
export const projetosService = {
  async findAll(): Promise<Projeto[]> {
    const { data } = await api.get<Projeto[]>('/projetos');
    return data;
  },

  async findById(id: number): Promise<Projeto> {
    const { data } = await api.get<Projeto>(`/projetos/${id}`);
    return data;
  },

  async create(dto: CreateProjetoDto): Promise<Projeto> {
    const { data } = await api.post<Projeto>('/projetos', dto);
    return data;
  },

  async update(id: number, dto: Partial<CreateProjetoDto>): Promise<Projeto> {
    const { data } = await api.patch<Projeto>(`/projetos/${id}`, dto);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projetos/${id}`);
  },
};
