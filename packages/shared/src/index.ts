// Tipos TypeScript compartilhados entre API e frontend.
// Espelham as entidades do banco de dados para garantir contrato entre as camadas.

export interface Cliente {
  id: number;
  name: string;
  projects?: Projeto[];
  createdAt: string;
  updatedAt: string;
}

export interface Projeto {
  id: number;
  name: string;
  clienteId: number;
  cliente?: Cliente;
  updates?: AtualizacaoMensal[];
  createdAt: string;
  updatedAt: string;
}

export interface AtualizacaoMensal {
  id: number;
  projetoId: number;
  projeto?: Projeto;
  month: number;
  year: number;
  entries?: EntradaFinanceira[];
  createdAt: string;
  updatedAt: string;
}

export interface EntradaFinanceira {
  id: number;
  atualizacaoMensalId: number;
  revenue: number;
  margin: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs de criação — usados nos formulários e chamadas à API
export interface CreateClienteDto {
  name: string;
}

export interface CreateProjetoDto {
  name: string;
  clienteId: number;
}

export interface CreateAtualizacaoMensalDto {
  month: number;
  year: number;
}

export interface CreateEntradaFinanceiraDto {
  revenue: number;
  margin: number;
  description: string;
}
