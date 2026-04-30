import { MigrationInterface, QueryRunner } from 'typeorm';

// Adiciona índices explícitos nas colunas de chave estrangeira para otimizar JOINs e lookups.
// PostgreSQL cria índice automático apenas para PKs e colunas com UNIQUE — FKs precisam ser manuais.
export class AddFkIndexes1700000000001 implements MigrationInterface {
  name = 'AddFkIndexes1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_projetos_cliente_id" ON "projetos" ("cliente_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_atualizacoes_mensais_projeto_id" ON "atualizacoes_mensais" ("projeto_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_entradas_financeiras_atualizacao_mensal_id" ON "entradas_financeiras" ("atualizacao_mensal_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_entradas_financeiras_atualizacao_mensal_id"`);
    await queryRunner.query(`DROP INDEX "IDX_atualizacoes_mensais_projeto_id"`);
    await queryRunner.query(`DROP INDEX "IDX_projetos_cliente_id"`);
  }
}
