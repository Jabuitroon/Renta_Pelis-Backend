import {
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { AuthProviderEnum, UserRole } from '../../generated/prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsString()
  country!: string;

  @IsString()
  language!: string;

  @IsString()
  authProvider!: AuthProviderEnum;
  @IsEnum(UserRole) // Valida que el valor coincida con el Enum de la DB entre admin y cliente
  @IsOptional() // Default(user) en Prisma
  role?: UserRole;
}
