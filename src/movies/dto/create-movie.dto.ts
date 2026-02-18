import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];
}
