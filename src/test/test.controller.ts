import { Body, Controller, Post } from '@nestjs/common';
import { EmailsService } from '../emails/emails.service';

@Controller('test')
export class TestController {
  constructor(private readonly emails: EmailsService) {}
  @Post()
  async test() {
    return await this.emails.sendEmail({
      to: ['buicynxbox3602020@gmail.com'],
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email.</p>',
    });
  }
}
