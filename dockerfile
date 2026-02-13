FROM node:20-alpine AS base

# 1. Instalar dependencias del sistema y pnpm de forma global
# Alpine necesita libc6-compat para algunos binarios de node_modules
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable

WORKDIR /app

FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

# 2. Copiar archivos de dependencias
# Usamos el comodín para que no falle si falta alguno, pero pnpm buscará el lock
COPY package.json pnpm-lock.yaml ./

# 3. Instalar dependencias
# Usamos --frozen-lockfile para asegurar que Docker use exactamente lo que dice tu lock
RUN pnpm install --frozen-lockfile

# 4. Copiar el resto del código del proyecto (excepto lo que esté en .dockerignore)
# Esto incluye tsconfig.json, nest-cli.json y archivos de configuración esenciales
COPY . .

# 5. Generar Prisma
RUN pnpm prisma generate

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
