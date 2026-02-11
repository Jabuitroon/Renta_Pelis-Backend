import 'dotenv/config';
import { z } from 'zod';

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
});

type envType = z.infer<typeof envSchema>;

const envParsed = envSchema.safeParse(process.env);

// Algo no se encuentra en .env como el puerto o nombre de db
if (!envParsed.success) {
  console.error('❌ Config validation error:', envParsed.error.format());
  throw new Error('Invalid environment variables');
}

export const envs: envType = {
  PORT: envParsed.data.PORT,
  ALLOWED_ORIGINS: envParsed.data.ALLOWED_ORIGINS,
  DATABASE_URL: envParsed.data.DATABASE_URL,
  REDIS_URL: envParsed.data.REDIS_URL,
  RESEND_API_KEY: envParsed.data.RESEND_API_KEY,
  RESEND_FROM_EMAIL: envParsed.data.RESEND_FROM_EMAIL,
};
