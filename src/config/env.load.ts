import * as dotenv from 'dotenv';
import { z } from 'zod';

// Detectamos cuál archivo cargar igual que en el package.json
const envFile = process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env';

// Cargamos manualmente el archivo correcto
dotenv.config({ path: envFile });

// Esquema de validación de variables de entorno con ZOD
export const envSchema = z.object({
  PORT: z.string().min(1, 'PORT is required.').transform(Number),
  // Un str que se transformará en un array de dominios separados por comandos
  ALLOWED_ORIGINS: z
    .string()
    .min(1, 'ALLOWED_ORIGINS is required.')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required.'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required.'),
  RESEND_FROM_EMAIL: z.string().min(1, 'RESEND_FROM_EMAIL is required.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required.'),
});
// Algo no se encuentra en .env como el puerto o nombre de db
