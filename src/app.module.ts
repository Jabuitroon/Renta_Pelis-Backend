import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { TokensModule } from './tokens/tokens.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TestModule } from './test/test.module';
import { redisStore } from 'cache-manager-redis-yet';
import { EmailsModule } from './emails/emails.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MoviesModule } from './movies/movies.module';
import { envSchema } from './config/env.load';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
      validate: (config) => {
        const parsed = envSchema.safeParse(config);
        console.log(`.${process.env.NODE_ENV}.env`, '.env');
        if (!parsed.success) {
          console.error('❌ Config validation error:', parsed.error.format());
          throw new Error('Invalid environment variables');
        }
        return parsed.data;
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL');
        console.log(url, 'url');

        return {
          store: await redisStore({
            url: url,
            ttl: 600,
            // Configuración necesaria para conexiones estables a servicios Cloud
            socket: {
              tls: process.env.NODE_ENV != 'develop', // Upstash requiere TLS activo
              reconnectStrategy: (retries) => {
                console.log(`Reconectando a Redis... Intento: ${retries}`);
                return Math.min(retries * 50, 500); // Estrategia de reconexión
              },
            },
          }),
        };
      },
    }),
    UsersModule,
    PrismaModule,
    SessionsModule,
    TokensModule,
    TestModule,
    EmailsModule,
    AuthModule,
    OrdersModule,
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
