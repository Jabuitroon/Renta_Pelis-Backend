import {
  IsArray,
  IsString,
  ArrayMinSize,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../../generated/prisma/client';

export class CreateOrderDto {
  // Separaremos los DTOs (que validan lo que llega del cliente) de las Interfaces (que definen la forma de los datos que viajan entre el front y el back).
  @IsArray()
  @IsString({ each: true }) // Cada elemento del array debe ser un string
  @IsNotEmpty({ each: true }) // Cada elemento del array no debe estar vacío
  @ArrayMinSize(1, {
    message: 'No se puede crear una orden sin al menos una película',
  })
  movieIds: string[];

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'El estado debe ser PENDING, PAID, CANCELED o REFUNDED',
  })
  status?: OrderStatus;
}
