import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from './dataSource';
import { Cliente } from '../entities/Cliente';
import { Projeto } from '../entities/Projeto';
import { AtualizacaoMensal } from '../entities/AtualizacaoMensal';
import { EntradaFinanceira } from '../entities/EntradaFinanceira';

// Script de seed para popular o banco com dados iniciais de demonstração.
// Remove dados existentes na ordem correta antes de inserir (respeita FKs).
config();

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Banco conectado. Iniciando seed...');

  const entradaRepo = AppDataSource.getRepository(EntradaFinanceira);
  const atualizacaoRepo = AppDataSource.getRepository(AtualizacaoMensal);
  const projetoRepo = AppDataSource.getRepository(Projeto);
  const clienteRepo = AppDataSource.getRepository(Cliente);

  // Limpa dados na ordem de dependência (filho antes do pai).
  await entradaRepo.delete({});
  await atualizacaoRepo.delete({});
  await projetoRepo.delete({});
  await clienteRepo.delete({});

  // 2 clientes.
  const cliente1 = await clienteRepo.save(clienteRepo.create({ name: 'Acme Corporation' }));
  const cliente2 = await clienteRepo.save(clienteRepo.create({ name: 'TechSolutions Ltda' }));

  // 3 projetos distribuídos entre os clientes.
  const projeto1 = await projetoRepo.save(projetoRepo.create({ name: 'Sistema ERP', clienteId: cliente1.id }));
  const projeto2 = await projetoRepo.save(projetoRepo.create({ name: 'Portal do Cliente', clienteId: cliente1.id }));
  const projeto3 = await projetoRepo.save(projetoRepo.create({ name: 'App Mobile', clienteId: cliente2.id }));

  // 2 atualizações mensais por projeto (jan e fev/2025).
  const [at1, at2, at3, at4, at5, at6] = await Promise.all([
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto1.id, month: 1, year: 2025 })),
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto1.id, month: 2, year: 2025 })),
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto2.id, month: 1, year: 2025 })),
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto2.id, month: 2, year: 2025 })),
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto3.id, month: 1, year: 2025 })),
    atualizacaoRepo.save(atualizacaoRepo.create({ projetoId: projeto3.id, month: 2, year: 2025 })),
  ]);

  // 2-3 entradas financeiras por atualização mensal.
  const entradasSeed = [
    { atualizacaoMensalId: at1.id, revenue: 150000, margin: 30.00, description: 'Desenvolvimento de módulo de estoque' },
    { atualizacaoMensalId: at1.id, revenue: 80000,  margin: 25.00, description: 'Consultoria técnica' },
    { atualizacaoMensalId: at1.id, revenue: 45000,  margin: 40.00, description: 'Treinamento da equipe' },
    { atualizacaoMensalId: at2.id, revenue: 160000, margin: 32.00, description: 'Desenvolvimento de módulo financeiro' },
    { atualizacaoMensalId: at2.id, revenue: 90000,  margin: 28.00, description: 'Customizações solicitadas' },
    { atualizacaoMensalId: at3.id, revenue: 120000, margin: 35.00, description: 'Design e UX do portal' },
    { atualizacaoMensalId: at3.id, revenue: 70000,  margin: 45.00, description: 'Integração com CRM' },
    { atualizacaoMensalId: at4.id, revenue: 130000, margin: 33.00, description: 'Implementação de chat ao vivo' },
    { atualizacaoMensalId: at4.id, revenue: 55000,  margin: 38.00, description: 'Melhorias de performance' },
    { atualizacaoMensalId: at4.id, revenue: 40000,  margin: 42.00, description: 'Suporte e manutenção' },
    { atualizacaoMensalId: at5.id, revenue: 200000, margin: 28.00, description: 'Desenvolvimento iOS e Android' },
    { atualizacaoMensalId: at5.id, revenue: 60000,  margin: 50.00, description: 'Integrações com APIs externas' },
    { atualizacaoMensalId: at6.id, revenue: 180000, margin: 30.00, description: 'Funcionalidades de notificação push' },
    { atualizacaoMensalId: at6.id, revenue: 75000,  margin: 35.00, description: 'Testes e QA' },
    { atualizacaoMensalId: at6.id, revenue: 50000,  margin: 44.00, description: 'Deploy e publicação nas lojas' },
  ];

  for (const entrada of entradasSeed) {
    await entradaRepo.save(entradaRepo.create(entrada));
  }

  console.log('Seed concluído com sucesso!');
  console.log(`  Clientes: 2 | Projetos: 3 | Atualizações: 6 | Entradas: ${entradasSeed.length}`);
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error('Erro no seed:', e);
  process.exit(1);
});
