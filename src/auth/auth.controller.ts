import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { RequestWithUser, responseAuth } from './interfaces';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<responseAuth> {
    return this.authService.register(payload);
  }

  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Get('profile')
  @UseGuards(AuthGuard) // Asegura que solo los usuarios autenticados puedan acceder a esta ruta
  // Decorador personalizado para fijar metadatos de roles requeridos
  getProfile(@Req() req: RequestWithUser) {
    // Implementar la lógica para obtener el perfil del usuario autenticado
    return this.authService.getProfile(req.user);
  }
}
