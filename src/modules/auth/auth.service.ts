import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../../common/services/email.service';
import { SmsService } from '../../common/services/sms.service';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';

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

    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Correo electronico no encontrado');
    }

    // Verificar si el correo electrónico está verificado
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('El correo electrónico no ha sido verificado.');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Si todo está correcto, devolver el usuario sin la contraseña
    const { password, ...result } = user;
    return result;
  }
  

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, };
    const userInfo = {name: user.name, email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: userInfo
    };
  }
  
  async register(createUserDto: CreateUserDto): Promise<void> {
    // Verificar si el correo electrónico ya está en uso
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Correo electrónico en uso');
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const token = uuidv4();
    await this.usersService.saveVerificationToken(user.id, token);
    await this.emailService.sendVerificationEmailRegister(user.email, token);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      return false;
    }
    await this.usersService.verifyEmail(user.id);
    return true;
  }

  ///////Ajusta el servicio de autenticación para manejar el envío dinámico de tokens y la verificación:

  async sendVerification(userId: number, method: 'email' | 'sms'): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const token = uuidv4().slice(0, 6);
    await this.usersService.saveVerificationToken(userId, token);

    if (method === 'email') {
      await this.emailService.sendVerificationEmail(user.email, token);
    } else if (method === 'sms') {
      await this.smsService.sendVerificationSms(user.phone, token);
    }
  }

  async verifyToken(userId: number, token: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    if (user.verificationToken === token) {
      await this.usersService.clearVerificationToken(userId);
      return true;
    }

    return false;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword, token} = changePasswordDto;
    
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('La contraseña antigua es incorrecta');
    }

    const isVerified = await this.verifyToken(userId, token);
    if (!isVerified) {
      throw new BadRequestException('Token de verificación no válido');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }
  //////David

  async sendVerificationPhone(userId: number): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const token = uuidv4().slice(0, 6);
    await this.usersService.saveVerificationToken(userId, token);
    await this.emailService.sendVerificationPhone(user.email, token);
  }

  async changePhone(userId: number, changePhoneDto: ChangePhoneDto): Promise<void> {
    const {oldPhone, newPhone, token} = changePhoneDto;
    
    const user = await this.usersService.findById(userId);
    if(!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const isOldPhoneValid = oldPhone === user.phone;
    if (!isOldPhoneValid) {
      throw new BadRequestException('El telefono antiguo es incorrecto');
    }

    const isVerified = await this.verifyToken(userId, token);
    if (!isVerified){
      throw new BadRequestException('Token de verificación no valido');
    }

    await this.usersService.updatePhone(userId, newPhone)
  }

  async sendVerificationPasswordRecovery(userId: number): Promise<void> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const token = uuidv4().slice(0, 6);
    await this.usersService.saveVerificationToken(userId, token);
    await this.emailService.sendVerificationEmail(user.email, token);
  }

  async recoveryPassword(userId: number, recoveryPassword: RecoveryPasswordDto): Promise<void> {
    const { newPassword, token} = recoveryPassword;
  
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const isVerified = await this.verifyToken(userId, token);
    if (!isVerified) {
      throw new BadRequestException('Token de verificación no válido');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }
}
