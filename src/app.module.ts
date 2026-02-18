import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.develop.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'redis', port: 6379 },
        }),
      }),
      inject: [ConfigService],
    }),
    // Configuración asíncrona para usar variables de entorno
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        // --- Para render.com ---
        // ssl: true,
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false, // Permite certificados auto-firmados de Render
        //   },
        // },
      }),
    }),
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
