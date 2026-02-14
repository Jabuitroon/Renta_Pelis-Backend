import {
  Controller,
  Post,
  Body,
  // UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { responseAuth } from './interfaces';
import { LoginDto } from './dto/login.dto';
//  import { LocalAuthGuard } from './guards/local-auth.guard';Creado con Passport

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
}
