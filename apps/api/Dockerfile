# Estágio de build: instala dependências e compila TypeScript para JavaScript.
# O contexto de build deve ser a raiz do monorepo para acessar packages/shared.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

RUN npm install

COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/api

# Estágio de execução: apenas os arquivos compilados, sem devDependencies.
# Usuário não-root para segurança em produção.
FROM node:20-alpine AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3001

CMD ["node", "dist/server.js"]
