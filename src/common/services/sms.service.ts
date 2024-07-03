import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private client;

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendVerificationSms(to: string, token: string): Promise<void> {
    await this.client.messages.create({
      body: `Su código de verificación es: ${token}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}