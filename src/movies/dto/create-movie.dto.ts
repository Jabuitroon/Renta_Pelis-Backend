import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { GenreType } from '../../generated/prisma/client'; // Importa el Enum generado por Prisma

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsDateString()
  released?: string;

  @IsOptional()
  @IsString()
  plot?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsArray()
  @IsEnum(GenreType, { each: true }) // Valida que cada género esté en el Enum
  genres: GenreType[];
}
