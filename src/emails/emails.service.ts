import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Email } from './interface';

@Injectable()
export class EmailsService {
  private readonly resend: Resend;

  constructor(private configService: ConfigService) {
    const RESEND_API_KEY = configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(RESEND_API_KEY);
  }

  async sendEmail({ to, subject, html }: Email) {
    try {
      return await this.resend.emails.send({
        from: `BackPelis <${this.configService.get<string>('RESEND_FROM_EMAIL')}>`,
        to: to.join(', '),
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException('Error al Enviar Email: ' + errorMessage);
    }
  }
  async sendBatchEmail(emails: Email[]) {
    return await this.resend.batch.send(
      emails.map(({ to, subject, html }) => ({
        from: `BackPelis <${this.configService.get<string>('RESEND_FROM_EMAIL')}>`,
        to: to.join(', '),
        subject,
        html,
      })),
    );
  }
}
