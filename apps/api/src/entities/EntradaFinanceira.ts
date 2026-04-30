import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AtualizacaoMensal } from './AtualizacaoMensal';

// Entidade que representa uma linha de receita dentro de uma atualização mensal.
// Tabela: "entradas_financeiras".
@Entity('entradas_financeiras')
export class EntradaFinanceira {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relação N:1 com AtualizacaoMensal.
  @ManyToOne(() => AtualizacaoMensal, (atualizacao) => atualizacao.entries)
  @JoinColumn({ name: 'atualizacao_mensal_id' })
  atualizacaoMensal!: AtualizacaoMensal;

  @Column({ name: 'atualizacao_mensal_id' })
  atualizacaoMensalId!: number;

  // Receita bruta em reais (precisão de 15 dígitos com 2 casas decimais).
  @Column({ name: 'receita', type: 'decimal', precision: 15, scale: 2 })
  revenue!: number;

  // Margem percentual entre 0.00 e 100.00.
  @Column({ name: 'margem', type: 'decimal', precision: 5, scale: 2 })
  margin!: number;

  // Descrição textual da entrada financeira.
  @Column({ name: 'descricao', type: 'text' })
  description!: string;

  @CreateDateColumn({ name: 'criado_em' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  updatedAt!: Date;
}
