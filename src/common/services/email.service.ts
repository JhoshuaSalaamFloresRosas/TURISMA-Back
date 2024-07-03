import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmailRegister(to: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Verificación de correo electrónico',
      text: `Haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationUrl}`,
      html: `<p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };
    await this.transporter.sendMail(mailOptions);
   }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Change Verification',
      text: `Your verification code is: ${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}