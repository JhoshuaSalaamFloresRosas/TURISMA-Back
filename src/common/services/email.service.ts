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
   const formatter = new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'full',
    timeStyle: 'short',
    hour12: true,
    timeZone: 'UTC',
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <img src="https://res.cloudinary.com/dhhbnvuhm/image/upload/v1720916301/DefaultProfile.jpg" alt="Logo de la empresa" style="display: block; margin: 0 auto 20px; width: 150px;">
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 18px; color: #333; margin: 0 0 20px;">Gracias por su pago. Aquí están los detalles de su excursión:</p>
          <p style="font-size: 16px; color: #333; margin: 0 0 10px;"><strong>Excursión:</strong> ${excursion}</p>
          <p style="font-size: 16px; color: #333; margin: 0 0 10px;"><strong>Puntos de parada:</strong></p>
          <ul style="font-size: 16px; color: #333; padding-left: 20px; margin: 0 0 20px;">${stopPointsList}</ul>
          <p style="font-size: 16px; color: #333; margin: 0 0 10px;"><strong>Fecha y hora de salida:</strong> ${formattedDate}</p>
          <p style="font-size: 16px; color: #333; margin: 0 0 20px;"><strong>Punto de salida:</strong> ${outPoint}</p>
        </div>
      </div>
      `,
      };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationPhone(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Verificación de cambio de Telefono',
      text: `Su código de verificación es: ${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendReservationDetails(to: string, excursionName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Detalles de tu reservación',
      text: `Reservación a ${excursionName} hecha, muchas gracias. No olvides pagar tu reservación dentro de las 48 horas o será cancelada y perderás tus asientos.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  
  async sendCancellationEmail(to: string, excursionName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Cancelación de reservación',
      text: `Tu reservación para la excursión ${excursionName} ha sido cancelada.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}