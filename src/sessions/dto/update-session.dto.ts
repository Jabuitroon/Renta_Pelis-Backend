import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
