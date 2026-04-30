import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '@controle-financeiro/shared': '<rootDir>/../../packages/shared/src',
  },
  // Coleta cobertura somente dos arquivos de serviço (onde reside a lógica de negócio).
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/services/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Suprime saída do logger pino durante os testes.
  testEnvironmentOptions: {
    env: { NODE_ENV: 'test' },
  },
};

export default config;
