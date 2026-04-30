import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from './Projeto';

// Entidade que representa um cliente no sistema.
// Tabela: "clientes" (PT-BR conforme convenção do projeto).
@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: false })
  name!: string;

  // Um cliente pode ter múltiplos projetos associados.
  @OneToMany(() => Projeto, (projeto) => projeto.cliente)
  projects!: Projeto[];

  @CreateDateColumn({ name: 'criado_em' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  updatedAt!: Date;
}
