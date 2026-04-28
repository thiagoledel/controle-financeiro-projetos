import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Projeto } from './Projeto';
import { EntradaFinanceira } from './EntradaFinanceira';

// Entidade que representa a consolidação financeira mensal de um projeto.
// Tabela: "atualizacoes_mensais".
// A constraint UNIQUE em (projetoId, month, year) garante apenas um registro por projeto/mês/ano.
@Entity('atualizacoes_mensais')
@Unique(['projetoId', 'month', 'year'])
export class AtualizacaoMensal {
  @PrimaryGeneratedColumn()
  id: number;

  // Relação N:1 com Projeto.
  @ManyToOne(() => Projeto, (projeto) => projeto.updates)
  @JoinColumn({ name: 'projeto_id' })
  projeto: Projeto;

  @Column({ name: 'projeto_id' })
  projetoId: number;

  // Mês de referência (1 a 12).
  @Column({ name: 'mes', type: 'int' })
  month: number;

  // Ano de referência (>= 2000).
  @Column({ name: 'ano', type: 'int' })
  year: number;

  // Uma atualização mensal pode ter múltiplas entradas financeiras.
  @OneToMany(() => EntradaFinanceira, (entrada) => entrada.atualizacaoMensal)
  entries: EntradaFinanceira[];

  @CreateDateColumn({ name: 'criado_em' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  updatedAt: Date;
}
