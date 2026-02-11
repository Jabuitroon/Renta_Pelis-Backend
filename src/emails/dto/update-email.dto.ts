import { PartialType } from '@nestjs/swagger';
import { SendEmailDto } from './send-email.dto';

export class UpdateEmailDto extends PartialType(SendEmailDto) {}
