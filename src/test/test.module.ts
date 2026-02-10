import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TestController } from './test.controller';
import { TokensService } from '../tokens/tokens.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [TestController],
  providers: [TokensService],
})
export class TestModule {}
