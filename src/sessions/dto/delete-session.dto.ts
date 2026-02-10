import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class DeleteSessionDto extends PartialType(CreateSessionDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
