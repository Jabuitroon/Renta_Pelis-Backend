import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { QualityOption, TransactionType } from '../../generated/prisma/client';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  // Separaremos los DTOs (que validan lo que llega del cliente) de las Interfaces (que definen la forma de los datos que viajan entre el front y el back).
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(QualityOption)
  quality: QualityOption;
}
