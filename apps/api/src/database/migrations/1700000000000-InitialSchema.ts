import { MigrationInterface, QueryRunner } from 'typeorm';

// Migration inicial: cria todas as tabelas do sistema com colunas em PT-BR.
// Inclui chaves estrangeiras com CASCADE para facilitar remoção em cascata.
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "clientes" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clientes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "projetos" (
        "id" SERIAL NOT NULL,
        "nome" character varying NOT NULL,
        "cliente_id" integer NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projetos" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "atualizacoes_mensais" (
        "id" SERIAL NOT NULL,
        "projeto_id" integer NOT NULL,
        "mes" integer NOT NULL,
        "ano" integer NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_atualizacoes_mensais_projeto_mes_ano" UNIQUE ("projeto_id", "mes", "ano"),
        CONSTRAINT "PK_atualizacoes_mensais" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "entradas_financeiras" (
        "id" SERIAL NOT NULL,
        "atualizacao_mensal_id" integer NOT NULL,
        "receita" numeric(15, 2) NOT NULL,
        "margem" numeric(5, 2) NOT NULL,
        "descricao" text NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_entradas_financeiras" PRIMARY KEY ("id")
      )
    `);

    // Chaves estrangeiras com DELETE CASCADE para consistência referencial automática.
    await queryRunner.query(`
      ALTER TABLE "projetos"
      ADD CONSTRAINT "FK_projetos_clientes"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "atualizacoes_mensais"
      ADD CONSTRAINT "FK_atualizacoes_mensais_projetos"
      FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "entradas_financeiras"
      ADD CONSTRAINT "FK_entradas_financeiras_atualizacoes"
      FOREIGN KEY ("atualizacao_mensal_id") REFERENCES "atualizacoes_mensais"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "entradas_financeiras" DROP CONSTRAINT "FK_entradas_financeiras_atualizacoes"`);
    await queryRunner.query(`ALTER TABLE "atualizacoes_mensais" DROP CONSTRAINT "FK_atualizacoes_mensais_projetos"`);
    await queryRunner.query(`ALTER TABLE "projetos" DROP CONSTRAINT "FK_projetos_clientes"`);
    await queryRunner.query(`DROP TABLE "entradas_financeiras"`);
    await queryRunner.query(`DROP TABLE "atualizacoes_mensais"`);
    await queryRunner.query(`DROP TABLE "projetos"`);
    await queryRunner.query(`DROP TABLE "clientes"`);
  }
}
