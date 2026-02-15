import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../providers/hashing/hashing.service';
import { BcryptService } from '../providers/hashing/bcrypt.service';

// RegisterAsync para inyectar el ConfigService y evitar errores de "undefined" al intentar leer la clave secreta.
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      // inject: [ConfigService],
      global: true,
      secret: process.env.JWT_SECRET, // <--- AQUÍ SE DEFINE LA KEY
      signOptions: { expiresIn: '2h' },
      // useFactory: (config: ConfigService) => ({
      //   secret: config.get<string>('JWT_SECRET'),
      //   signOptions: {
      //     expiresIn: config.get<number>('JWT_EXPIRES_IN') || 3600,
      //   },
      // }),
    }),
  ],
  providers: [
    AuthService,
    {
      provide: HashingService, // Cuando alguien pida HashingService...
      useClass: BcryptService, // ...dale una instancia de BcryptService.
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
