import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import {
  GenreType,
  QualityOption,
  TransactionType,
} from '../../generated/prisma/client'; // Importa el Enum generado por Prisma
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PriceDto {
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsEnum(QualityOption)
  quality: QualityOption;

  @IsNumber()
  price: number;
}

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

  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '2023-12-04T16:30:00Z' })
  @IsISO8601()
  @IsNotEmpty()
  released?: string;

  @IsString()
  @IsNotEmpty()
  runtime: string;

  @IsOptional()
  @IsString()
  plot?: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsNotEmpty()
  awards?: string;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsArray()
  @IsEnum(GenreType, { each: true }) // Valida que cada género esté en el Enum
  genres: GenreType[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];
}
