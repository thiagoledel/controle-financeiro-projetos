import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from './Cliente';
import { AtualizacaoMensal } from './AtualizacaoMensal';

// Entidade que representa um projeto vinculado a um cliente.
// Tabela: "projetos".
@Entity('projetos')
export class Projeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', nullable: false })
  name: string;

  // Relação N:1 com Cliente — cada projeto pertence a um único cliente.
  @ManyToOne(() => Cliente, (cliente) => cliente.projects)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // Expõe o valor da FK diretamente para facilitar inserções sem carregar a relação.
  @Column({ name: 'cliente_id' })
  clienteId: number;

  // Um projeto pode ter múltiplas atualizações mensais.
  @OneToMany(() => AtualizacaoMensal, (atualizacao) => atualizacao.projeto)
  updates: AtualizacaoMensal[];

  @CreateDateColumn({ name: 'criado_em' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  updatedAt: Date;
}
