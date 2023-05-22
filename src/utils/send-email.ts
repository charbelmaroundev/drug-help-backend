import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      }),
    );
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: `${process.env.GMAIL_NAME} ${process.env.GMAIL}`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
