# Stage 1: Base & Dependencies
FROM node:20-alpine AS base

# 1. Instalar dependencias del sistema y pnpm de forma global
# Alpine necesita libc6-compat para algunos binarios de node_modules
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable

WORKDIR /app
ENV CI=true

# 2. Copiar archivos de dependencias
# Usamos el comodín para que no falle si falta alguno, pero pnpm buscará el lock
COPY package.json pnpm-lock.yaml ./

# 3. Instalar dependencias
# Usamos --frozen-lockfile para asegurar que Docker use exactamente lo que dice tu lock
RUN pnpm install --frozen-lockfile

# Stage 2: Development (Para usar con docker-compose)
FROM base AS development
ENV NODE_ENV=development    
COPY . .
# En dev no hacemos build, usamos el código fuente directamente
CMD ["pnpm", "run", "start:dev"]

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
# 1. Copiar el resto del código del proyecto (excepto lo que esté en .dockerignore)
# Esto incluye tsconfig.json, nest-cli.json y archivos de configuración esenciales
COPY . .

# 4. Generar Prisma (Usamos una URL dummy para que el build no falle)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpx prisma generate

# Aseguramos que NODE_ENV sea production para el build de Nest
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm run build
# Limpiamos para dejar solo lo necesario para ejecución
RUN pnpm prune --production

# Stage 4: Production
FROM base AS production
WORKDIR /app

# Seteamos el entorno a producción por defecto
ENV NODE_ENV=production
# Argumento de seguridad: No correr como root
RUN chown -R node:node /app
USER node

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package*.json ./

# Copia la carpeta generada desde el builder a la misma ruta en producción
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
# Opcional pero recomendado: Copia el schema para migraciones o introspección
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000

CMD ["sh", "-c", "pnpx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main"]
