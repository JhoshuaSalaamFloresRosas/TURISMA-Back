import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../../common/services/email.service';
import { SmsService } from '../../common/services/sms.service';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, };
    const userInfo = {name: user.name, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: userInfo
    };
  }

  ///////Ajusta el servicio de autenticación para manejar el envío dinámico de tokens y la verificación:

  async sendVerification(userId: number, method: 'email' | 'sms'): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = uuidv4();
    await this.usersService.saveVerificationToken(userId, token);

    if (method === 'email') {
      await this.emailService.sendVerificationEmail(user.email, token);
    } else if (method === 'sms') {
      await this.smsService.sendVerificationSms(user.phone, token);
    }
  }

  async verifyToken(userId: number, token: string, method: 'email' | 'sms'): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    if (user.verificationToken === token) {
      await this.usersService.clearVerificationToken(userId);
      return true;
    }

    return false;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword, token, method } = changePasswordDto;
    const isVerified = await this.verifyToken(userId, token, method);

    if (!isVerified) {
      throw new BadRequestException('Invalid verification token');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }
  //////David

}
