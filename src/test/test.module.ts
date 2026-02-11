import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TokensService } from '../tokens/tokens.service';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [EmailsModule],
  controllers: [TestController],
  providers: [TokensService],
})
export class TestModule {}
