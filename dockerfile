FROM node:24-alpine

# 1. Instalar dependencias del sistema y pnpm de forma global
# Alpine necesita libc6-compat para algunos binarios de node_modules
RUN apk add --no-cache openssl libc6-compat && \
    npm install -g pnpm

WORKDIR /usr/src/app

# 2. Copiar archivos de dependencias
# Usamos el comodín para que no falle si falta alguno, pero pnpm buscará el lock
COPY package.json pnpm-lock.yaml* ./

# 3. Instalar dependencias
# Usamos --frozen-lockfile para asegurar que Docker use exactamente lo que dice tu lock
RUN pnpm install

# 4. Copiar el resto del código
COPY . .

# 5. Generar Prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]