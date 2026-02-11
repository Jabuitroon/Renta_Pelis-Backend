import { BadRequestException, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { envs } from '../config/env.load';
import { Email } from './interface';

@Injectable()
export class EmailsService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(envs.RESEND_API_KEY);
  }

  async sendEmail({ to, subject, html }: Email) {
    try {
      return await this.resend.emails.send({
        from: `BackPelis <${envs.RESEND_FROM_EMAIL}>`,
        to: to.join(', '),
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al Buscar Usuarios: ' + errorMessage,
      );
    }
  }
  async sendBatchEmail(emails: Email[]) {
    return await this.resend.batch.send(
      emails.map(({ to, subject, html }) => ({
        from: `BackPelis <${envs.RESEND_FROM_EMAIL}>`,
        to: to.join(', '),
        subject,
        html,
      })),
    );
  }
}
