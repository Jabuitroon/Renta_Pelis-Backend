import { Body, Controller, Get } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { AuthorizationToken } from '../common/enums/authorization-token.enum';

@Controller('test')
export class TestController {
  constructor(private readonly tokens: TokensService) {}
  @Get()
  async test() {
    return await this.tokens.generateToken({
      userId: 'ad2b43f6-60c6-45b7-a249-0d7028b74081',
      type: AuthorizationToken.CONFIRM_EMAIL,
    });
  }
}
