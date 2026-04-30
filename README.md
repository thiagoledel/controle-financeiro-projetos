# 💰 Controle Financeiro de Projetos

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-green)

> Sistema web para controle de atualizações financeiras mensais por projeto

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitetura](#arquitetura)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação e Configuração](#instalação-e-configuração)
6. [Como Executar](#como-executar)
7. [Referência da API](#referência-da-api)
8. [Esquema do Banco de Dados](#esquema-do-banco-de-dados)
9. [Funcionalidades](#funcionalidades)
10. [Exemplos de Uso](#exemplos-de-uso)
11. [Licença](#licença)

---

## Visão Geral

O **Controle Financeiro de Projetos** é uma aplicação web full-stack desenvolvida para facilitar o acompanhamento das receitas e margens financeiras de projetos ao longo do tempo. O sistema organiza as informações em uma hierarquia clara: **clientes** possuem **projetos**, projetos acumulam **atualizações mensais** e cada atualização contém uma ou mais **entradas financeiras** com receita, margem e descrição.

A aplicação foi construída como um monorepo TypeScript com separação estrita entre frontend, backend e pacote de tipos compartilhados. O backend expõe uma API REST via Express com validação de esquema via Zod, persistência via TypeORM e PostgreSQL, e log estruturado via Pino. O frontend consome a API com TanStack Query, exibe tabelas interativas com TanStack Table e oferece uma interface dark moderna com Tailwind CSS.

A integridade dos dados é garantida no banco de dados por meio de constraints e índices: existe uma restrição de unicidade que impede o cadastro de mais de uma atualização mensal para o mesmo projeto, mês e ano. Deleções em cascata garantem que ao remover um projeto todos os seus dados financeiros sejam removidos automaticamente.

A arquitetura segue o padrão Controller → Service → Repositório TypeORM → PostgreSQL com injeção de dependências via construtor, o que permite testes unitários isolados sem dependência de banco real. Testes de integração com Supertest cobrem o pipeline HTTP completo, incluindo validação de esquema e tratamento de erros.

### Funcionalidades Principais

- **Gestão de clientes e projetos** com relacionamento N:1
- **Controle de atualizações financeiras mensais** por projeto (mês e ano)
- **Registro de receita, margem percentual e descrição** por entrada financeira
- **Restrição de unicidade**: uma atualização por mês/ano por projeto (constraint no banco)
- **Interface dark** com paleta azul, preto, branco, verde e goiaba (via Tailwind CSS)
- **Validação de esquema** em todas as rotas (Zod + middleware centralizado)
- **Notificações toast** de sucesso e erro em tempo real
- **100% de cobertura de testes** nos serviços de negócio

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | 20 |
| Linguagem | TypeScript | 5.3 |
| Framework HTTP | Express | 4.18 |
| ORM | TypeORM | 0.3 |
| Banco de Dados | PostgreSQL | 16 |
| Frontend | React | 18 |
| Build Tool | Vite | 5 |
| Gerenciamento de Estado | TanStack Query | 5 |
| Tabelas | TanStack Table | 8 |
| Estilização | Tailwind CSS | 3 |
| Cliente HTTP | Axios | 1.6 |
| Validação | Zod | 3.22 |
| Testes | Jest + ts-jest + Supertest | 29 |
| Notificações | Sonner | 1 |
| Log | Pino | 8 |
| Containers | Docker + Docker Compose | — |

---

## Arquitetura

### Estrutura do Monorepo

```
controle-financeiro-projetos/
├── apps/
│   ├── api/                          # Servidor Express (Node.js)
│   │   ├── src/
│   │   │   ├── controllers/          # Camada HTTP: parse de parâmetros e resposta
│   │   │   ├── services/             # Regras de negócio e validações
│   │   │   ├── entities/             # Entidades TypeORM mapeadas ao banco
│   │   │   ├── middlewares/          # errorHandler, validateRequest, asyncHandler
│   │   │   ├── schemas/              # Schemas Zod para validação de entrada
│   │   │   ├── routes/               # Registro central de rotas e injeção de dependências
│   │   │   ├── database/
│   │   │   │   ├── dataSource.ts     # Configuração do DataSource TypeORM
│   │   │   │   ├── migrations/       # Migrations versionadas (schema-first)
│   │   │   │   └── seed.ts           # Dados iniciais para desenvolvimento
│   │   │   ├── errors/               # AppError (erro operacional com statusCode)
│   │   │   └── lib/                  # Logger Pino centralizado
│   │   ├── jest.config.ts
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── web/                          # Frontend React + Vite
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/           # Layout, Sidebar, PageHeader
│       │   │   └── ui/               # Button, Modal, Input, Select, Badge, DataTable...
│       │   ├── pages/
│       │   │   ├── clientes/         # ClientesPage, ClienteDetalhePage
│       │   │   └── projetos/         # ProjetosPage, ProjetoDetalhePage
│       │   ├── hooks/                # useClientes, useProjetos, useAtualizacoesMensais...
│       │   ├── services/             # Clientes HTTP (Axios) por recurso
│       │   └── utils/                # formatters.ts (moeda, percentual, mês)
│       ├── tsconfig.json
│       └── Dockerfile
│
├── packages/
│   └── shared/                       # Tipos TypeScript compartilhados entre api e web
│       └── src/
│           └── index.ts              # DTOs, interfaces de entidade e tipos de resposta
│
├── .env.example                      # Variáveis de ambiente documentadas
├── docker-compose.yml                # Orquestração: db + api + web
├── tsconfig.base.json                # Configuração base do TypeScript (strict: true)
└── package.json                      # Workspaces npm: apps/api, apps/web, packages/shared
```

### Camadas da Aplicação

```
Requisição HTTP
      │
      ▼
┌─────────────────────────────────┐
│  Middlewares globais            │  helmet, cors, rate-limit, express.json()
├─────────────────────────────────┤
│  validateRequest (Zod)          │  Valida body/params antes de chegar ao controller
├─────────────────────────────────┤
│  Controller                     │  Parse de parâmetros, chamada ao service, resposta JSON
├─────────────────────────────────┤
│  Service                        │  Regras de negócio, validações de domínio, AppError
├─────────────────────────────────┤
│  Repositório TypeORM            │  Acesso ao banco — find, save, remove
├─────────────────────────────────┤
│  PostgreSQL 16                  │  Persistência, constraints, índices, cascades
└─────────────────────────────────┘
      │
      ▼  (erro em qualquer camada)
┌─────────────────────────────────┐
│  errorHandler                   │  AppError → status HTTP, QueryFailedError → 409/404
└─────────────────────────────────┘
```

### Convenções

| Escopo | Convenção |
|--------|-----------|
| Tabelas e colunas do banco | Português (ex: `clientes`, `nome`, `criado_em`) |
| Código-fonte (variáveis, funções, classes) | Inglês |
| Comentários inline | Português (PT-BR) |
| Commits | Conventional Commits (`feat`, `fix`, `refactor`) |
| Rotas da API | Inglês (ex: `/api/clientes`, `/api/projetos`) |

---

## Pré-requisitos

- **Node.js** >= 20 ([download](https://nodejs.org/))
- **Docker Desktop** >= 4 com Docker Compose v2 ([download](https://www.docker.com/products/docker-desktop/))
- **Git** ([download](https://git-scm.com/))

---

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/thiagoledel/controle-financeiro-projetos.git
cd controle-financeiro-projetos
```

### 2. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores desejados. As variáveis disponíveis são:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_USER` | Usuário do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha do PostgreSQL | `postgres` |
| `DB_NAME` | Nome do banco de dados | `financial_tracker` |
| `DATABASE_URL` | URL completa de conexão com o banco | — |
| `PORT` | Porta da API Express | `3001` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `CORS_ORIGIN` | Origem permitida em produção | (vazio = desativado) |

### 3. Subir o banco de dados

```bash
docker compose up -d db
```

Aguarde o healthcheck do serviço `db` completar (o postgres fica pronto em ~5 segundos).

### 4. Instalar as dependências

```bash
npm install
```

O npm workspaces instala as dependências de todos os pacotes (`apps/api`, `apps/web`, `packages/shared`) a partir da raiz do monorepo.

### 5. Rodar as migrations

```bash
npm run migration:run --workspace=apps/api
```

Cria as 4 tabelas (`clientes`, `projetos`, `atualizacoes_mensais`, `entradas_financeiras`) e os índices de chave estrangeira.

### 6. Popular o banco com dados de exemplo

```bash
npm run seed --workspace=apps/api
```

Insere clientes, projetos e atualizações de exemplo para facilitar a exploração da aplicação.

### 7. Iniciar em modo de desenvolvimento

```bash
npm run dev
```

Ou separadamente por serviço:

```bash
# Apenas o backend (hot-reload via ts-node-dev)
npm run dev --workspace=apps/api

# Apenas o frontend (hot-reload via Vite)
npm run dev --workspace=apps/web
```

Acesse o frontend em **http://localhost:5173** e a API em **http://localhost:3001/api**.

---

## Como Executar

### Desenvolvimento local

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia todos os serviços em modo desenvolvimento |
| `npm run dev --workspace=apps/api` | Inicia apenas o servidor Express com hot-reload |
| `npm run dev --workspace=apps/web` | Inicia apenas o Vite dev server |

### Build de produção

| Comando | Descrição |
|---------|-----------|
| `npm run build --workspace=apps/api` | Compila o TypeScript da API para `dist/` |
| `npm run build --workspace=apps/web` | Gera os arquivos estáticos otimizados do frontend |

### Testes

| Comando | Descrição |
|---------|-----------|
| `npm test --workspace=apps/api` | Executa todos os testes (unitários + integração) com cobertura |

### Migrations

| Comando | Descrição |
|---------|-----------|
| `npm run migration:run --workspace=apps/api` | Aplica todas as migrations pendentes |
| `npm run migration:revert --workspace=apps/api` | Reverte a última migration aplicada |
| `npm run migration:generate --workspace=apps/api` | Gera uma nova migration baseada nas entidades |

### Banco de dados

| Comando | Descrição |
|---------|-----------|
| `npm run seed --workspace=apps/api` | Popula o banco com dados de exemplo |

### Docker

| Comando | Descrição |
|---------|-----------|
| `docker compose up -d` | Sobe todos os containers (db + api + web) em background |
| `docker compose up -d db` | Sobe apenas o banco de dados |
| `docker compose down` | Para e remove todos os containers |
| `docker compose down -v` | Para containers e remove o volume de dados do banco |
| `docker compose logs -f api` | Acompanha os logs da API em tempo real |

---

## Referência da API

Todos os endpoints retornam JSON com o formato padronizado:

**Sucesso:** `{ "data": <payload>, "message": "<mensagem>" }`

**Erro:** `{ "error": { "message": "<mensagem>", "statusCode": <código> } }`

### Clientes

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/api/clientes` | Lista todos os clientes (inclui projetos vinculados) | — |
| `GET` | `/api/clientes/:id` | Busca cliente por ID | — |
| `POST` | `/api/clientes` | Cria um novo cliente | `{ "name": "string (2-100 chars)" }` |
| `PUT` | `/api/clientes/:id` | Atualiza nome do cliente | `{ "name": "string (2-100 chars)" }` |
| `DELETE` | `/api/clientes/:id` | Remove cliente (409 se possuir projetos) | — |

### Projetos

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/api/projetos` | Lista todos os projetos (inclui cliente) | — |
| `GET` | `/api/projetos/:id` | Busca projeto por ID (inclui atualizações e entradas) | — |
| `POST` | `/api/projetos` | Cria um novo projeto vinculado a um cliente | `{ "name": "string", "clienteId": number }` |
| `PUT` | `/api/projetos/:id` | Atualiza nome ou cliente do projeto | `{ "name"?: "string", "clienteId"?: number }` |
| `DELETE` | `/api/projetos/:id` | Remove projeto e todos os dados financeiros | — |

### Atualizações Mensais

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/api/projetos/:projetoId/atualizacoes` | Lista atualizações do projeto (ordenadas por data desc) | — |
| `GET` | `/api/projetos/:projetoId/atualizacoes/:id` | Busca atualização por ID | — |
| `POST` | `/api/projetos/:projetoId/atualizacoes` | Cria atualização mensal (409 se mês/ano já existir) | `{ "month": 1-12, "year": 2000-2100 }` |
| `DELETE` | `/api/projetos/:projetoId/atualizacoes/:id` | Remove atualização e suas entradas (cascade) | — |

### Entradas Financeiras

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/api/atualizacoes/:atualizacaoId/entradas` | Lista entradas da atualização mensal | — |
| `POST` | `/api/atualizacoes/:atualizacaoId/entradas` | Cria entrada financeira | `{ "revenue": number > 0, "margin": 0-100, "description": "string (min 3)" }` |
| `PUT` | `/api/atualizacoes/:atualizacaoId/entradas/:id` | Atualiza entrada financeira | `{ "revenue"?: number, "margin"?: number, "description"?: string }` |
| `DELETE` | `/api/atualizacoes/:atualizacaoId/entradas/:id` | Remove entrada financeira | — |

---

## Esquema do Banco de Dados

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            ESQUEMA DO BANCO                                  │
└──────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐          ┌───────────────────────┐
│     clientes      │          │       projetos        │
├───────────────────┤  1    N  ├───────────────────────┤
│ id          SERIAL│◄─────────│ id            SERIAL  │
│ nome        VARCHAR│         │ nome          VARCHAR  │
│ criado_em   TIMESTAMP│       │ cliente_id    INTEGER ─┘ FK
│ atualizado_em TIMESTAMP│     │ criado_em     TIMESTAMP│
└───────────────────┘          │ atualizado_em TIMESTAMP│
                               └───────────┬───────────┘
                                           │ 1
                                           │
                                           │ N
                          ┌────────────────▼──────────────────┐
                          │       atualizacoes_mensais        │
                          ├───────────────────────────────────┤
                          │ id              SERIAL            │
                          │ projeto_id      INTEGER ──────────┘ FK
                          │ mes             INTEGER (1–12)    │
                          │ ano             INTEGER (2000–2100)│
                          │ criado_em       TIMESTAMP         │
                          │ atualizado_em   TIMESTAMP         │
                          │                                   │
                          │ UNIQUE (projeto_id, mes, ano)     │
                          └─────────────────┬─────────────────┘
                                            │ 1
                                            │
                                            │ N
                          ┌─────────────────▼─────────────────┐
                          │       entradas_financeiras        │
                          ├───────────────────────────────────┤
                          │ id                   SERIAL       │
                          │ atualizacao_mensal_id INTEGER ────┘ FK
                          │ receita              DECIMAL(15,2)│
                          │ margem               DECIMAL(5,2) │
                          │ descricao            TEXT         │
                          │ criado_em            TIMESTAMP    │
                          │ atualizado_em        TIMESTAMP    │
                          └───────────────────────────────────┘

Índices de FK:
  IDX_projetos_cliente_id
  IDX_atualizacoes_mensais_projeto_id
  IDX_entradas_financeiras_atualizacao_mensal_id

Cascades:
  projetos           → ON DELETE CASCADE (remove ao deletar cliente)
  atualizacoes_mensais → ON DELETE CASCADE (remove ao deletar projeto)
  entradas_financeiras → ON DELETE CASCADE (remove ao deletar atualização)
```

---

## Funcionalidades

### Backend (API REST)

- **Clientes**
  - Listar todos os clientes com projetos vinculados
  - Buscar cliente por ID
  - Criar cliente com validação de nome (2–100 caracteres)
  - Atualizar nome do cliente
  - Remover cliente (bloqueado com 409 se possuir projetos vinculados)

- **Projetos**
  - Listar todos os projetos com informações do cliente
  - Buscar projeto com atualizações mensais e entradas financeiras
  - Criar projeto vinculado a um cliente existente (validação de FK)
  - Atualizar nome ou cliente do projeto
  - Remover projeto com cascade automático das atualizações e entradas

- **Atualizações Mensais**
  - Listar atualizações de um projeto ordenadas por data decrescente
  - Criar atualização com validação de mês (1–12) e ano (2000–2100)
  - Impedir duplicidade de mês/ano por projeto (constraint UNIQUE + erro 409 descritivo)
  - Proteção cross-projeto: operações por ID verificam pertencimento ao projeto da rota
  - Remover atualização com cascade das entradas financeiras

- **Entradas Financeiras**
  - Listar entradas de uma atualização mensal
  - Criar entrada com validação de receita (> 0), margem (0–100) e descrição (mín. 3 chars)
  - Atualizar parcialmente qualquer campo da entrada
  - Remover entrada individual

- **Infraestrutura**
  - `asyncHandler` middleware: zero try/catch avulso nos controllers
  - `validateRequest` middleware: validação Zod centralizada antes de atingir o controller
  - `errorHandler` global: mapeamento de `AppError`, `QueryFailedError` e `EntityNotFoundError` para HTTP
  - Rate limiting: 100 requisições por IP a cada 15 minutos
  - Headers de segurança via Helmet
  - Logger estruturado Pino (JSON) em todos os pontos relevantes
  - Migrations versionadas (synchronize: false) com indexes explícitos nas FKs

### Frontend (React SPA)

- **Interface**
  - Tema dark com sidebar de navegação fixa
  - Paleta de cores: azul primário, preto, branco, verde (sucesso), goiaba (perigo)
  - Layout responsivo com Tailwind CSS

- **Gestão de Clientes**
  - Tabela de clientes com TanStack Table
  - Modal de criação com validação e feedback de loading
  - Edição inline via modal com campos pré-preenchidos
  - Remoção com diálogo de confirmação
  - Navegação para página de detalhe do cliente

- **Gestão de Projetos**
  - Tabela de projetos com nome do cliente
  - Modal de criação com seleção de cliente via dropdown
  - Edição e remoção com confirmação
  - Navegação para página de detalhe do projeto

- **Detalhe do Projeto — Atualizações Mensais**
  - Seções mensais expandidas com tabela de entradas por mês
  - Adicionar nova atualização mensal (seletor de mês e campo de ano)
  - Adicionar, editar e remover entradas financeiras dentro de cada mês
  - Total de receita exibido por seção mensal
  - Estado vazio amigável quando não há dados

- **UX e Acessibilidade**
  - Notificações toast (Sonner) para sucesso e erro em todas as mutações
  - Mensagens de erro da API exibidas no toast (interceptor Axios)
  - Modais com ESC para fechar e restauração de foco ao fechar
  - Botões desabilitados e com spinner durante mutações em andamento
  - `aria-label` em todos os botões de ação
  - Error Boundary com botão "Recarregar página"
  - Cache TanStack Query com staleTime de 5 minutos e retry exponencial

### Testes

- **Unitários** (4 suites): cobertura 100% de branches, funções, linhas e statements em todos os serviços
- **Integração** (2 suites, Supertest): pipeline HTTP completo com mock de serviços
  - POST `/api/clientes`: criação, validações de schema, erros 409 e 500
  - POST `/api/projetos/:id/atualizacoes`: criação, validação de month/year, conflito 23505, projeto inexistente

---

## Exemplos de Uso

### Exemplo 1 — Criar um cliente

```bash
# Cria um novo cliente chamado "Acme Corp".
# O campo name deve ter entre 2 e 100 caracteres.
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp"}'
```

**Resposta esperada (201 Created):**

```json
{
  "data": {
    "id": 1,
    "name": "Acme Corp",
    "projects": [],
    "createdAt": "2025-04-30T14:00:00.000Z",
    "updatedAt": "2025-04-30T14:00:00.000Z"
  },
  "message": "Cliente criado com sucesso"
}
```

> O campo `projects` é retornado vazio na criação. Ao buscar o cliente via `GET /api/clientes/1`, os projetos vinculados serão incluídos automaticamente.

---

### Exemplo 2 — Criar um projeto vinculado ao cliente

```bash
# Cria um projeto vinculado ao cliente de id 1 (criado no exemplo anterior).
# O campo clienteId deve referenciar um cliente existente; caso contrário, retorna 404.
curl -X POST http://localhost:3001/api/projetos \
  -H "Content-Type: application/json" \
  -d '{"name": "Redesign do Site", "clienteId": 1}'
```

**Resposta esperada (201 Created):**

```json
{
  "data": {
    "id": 1,
    "name": "Redesign do Site",
    "clienteId": 1,
    "cliente": {
      "id": 1,
      "name": "Acme Corp"
    },
    "updates": [],
    "createdAt": "2025-04-30T14:01:00.000Z",
    "updatedAt": "2025-04-30T14:01:00.000Z"
  },
  "message": "Projeto criado com sucesso"
}
```

> Para adicionar uma atualização mensal a este projeto, use o endpoint `POST /api/projetos/1/atualizacoes` com `{"month": 4, "year": 2025}`.

---

### Exemplo 3 — Adicionar entrada financeira em uma atualização mensal

```bash
# Antes de executar este exemplo, crie uma atualização mensal para o projeto:
# POST /api/projetos/1/atualizacoes com {"month": 4, "year": 2025} → retorna id = 1
#
# Em seguida, adiciona uma entrada financeira à atualização mensal de id 1.
# revenue deve ser maior que zero; margin deve estar entre 0 e 100.
curl -X POST http://localhost:3001/api/atualizacoes/1/entradas \
  -H "Content-Type: application/json" \
  -d '{"revenue": 150000.00, "margin": 35.50, "description": "Fechamento contratual Q1"}'
```

**Resposta esperada (201 Created):**

```json
{
  "data": {
    "id": 1,
    "atualizacaoMensalId": 1,
    "revenue": "150000.00",
    "margin": "35.50",
    "description": "Fechamento contratual Q1",
    "createdAt": "2025-04-30T14:02:00.000Z",
    "updatedAt": "2025-04-30T14:02:00.000Z"
  },
  "message": "Entrada financeira criada com sucesso"
}
```

> Os campos `revenue` e `margin` são armazenados como `DECIMAL` no PostgreSQL e retornados como strings para preservar a precisão numérica. Converta para `Number` no frontend ao exibir os valores formatados.

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com TypeScript, Express, React e PostgreSQL
</p>
