import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { HashingService } from '../providers/hashing/hashing.service';
import { responseAuth } from './interfaces';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  // Lógica para registrar un usuario
  async register(newUser: RegisterDto): Promise<responseAuth> {
    try {
      const user = await this.usersService.create(newUser);
      return {
        accessToken: 'fake-jwt-token', // Aquí deberías generar un token real usando JwtService
        // accessToken: this.jwtService.sign({ id: user.user_id }),
        user: {
          id: user.user_id,
          email: user.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error}`,
      );
    }
  }

  // Lógica para validar usuario en el Login
  async login({
    email,
    password,
  }: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await this.hashingService.compare(
      password.trim(),
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
