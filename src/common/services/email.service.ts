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
      subject: 'Verificación de cambio de contraseña',
      text: `Su código de verificación es: ${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationPay(
    to: string,
    excursion: string,
    stopPoints: {
      id: number;
      excursionId: number;
      name: string;
      numStop: number;
      duration: string;
    }[],
    departureDate: Date,
    outPoint: string
  ): Promise<void> {
    // Formatea la fecha y hora en español
    const formatter = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'full', // 'short', 'medium', 'long', 'full'
      timeStyle: 'short' // 'short', 'medium', 'long'
    });
    const formattedDate = formatter.format(departureDate);
  
    // Formatea stopPoints como una lista HTML
    const stopPointsList = stopPoints.map(
      point => `<li>Parada: ${point.name}, Número: ${point.numStop}, Duración: ${point.duration}</li>`
    ).join('');
  
    // Configura el correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Gracias por su pago',
      html: `
        <p>Gracias por su pago. Aquí están los detalles de su excursión:</p>
        <p><strong>Excursión:</strong> ${excursion}</p>
        <p><strong>Puntos de parada:</strong></p>
        <ul>${stopPointsList}</ul>
        <p><strong>Fecha y hora de salida:</strong> ${formattedDate}</p>
        <p><strong>Punto de salida:</strong> ${outPoint}</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}