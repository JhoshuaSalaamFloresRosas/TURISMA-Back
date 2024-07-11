import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return { message: 'Correo electrónico de verificación enviado. Por favor, revisa tu bandeja de entrada.' };
  }

  @Public()
  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string) {
    const isValid = await this.authService.verifyEmail(token);
    if (!isValid) {
      throw new BadRequestException('Token de verificación no válido o caducado.');
    }
    return { message: 'Correo electrónico verificado con éxito.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    await this.usersService.update(userId, updateUserDto);
    return {message: 'Usuario actualizado'}
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('send-verification')
  async sendVerification(@Request() req, @Body('method') method: 'email' | 'sms') {
    const userId = req.user.userId;
    await this.authService.sendVerification(userId, method);
    return { message: 'Código de verificación enviado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.userId;
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Contraseña cambiada correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteUser(@Request() req, @Body() body: { email: string }) {
    const userId = req.user.userId;
    const providedEmail = body.email;

    if (!providedEmail) {
      throw new BadRequestException('Se requiere proporcionar un correo electrónico para la eliminación');
    }

    return this.usersService.deleteUser(userId, providedEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-verification-Phone')
  async sendVerificationPhone(@Request() req) {
    const userId = req.user.userId;
    await this.authService.sendVerificationPhone(userId);
    return { message: 'Código de verificación enviado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-phone')
  async updatePhone(@Request() req, @Body() changePhone: ChangePhoneDto) {
    const userId = req.user.userId;
    await this.authService.changePhone(userId, changePhone);
    return {message: 'Telefono cambiado correctamente'}
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-verification-recovery')
  async sendVerificationRecovery(@Request() req,){
    const userId = req.user.userId;
    await this.authService.sendVerificationRecovery(userId);
    return { message: 'Código de verificación enviado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password-recovery')
  async passwordRecovery(@Request() req, @Body() recoveryPassword: RecoveryPasswordDto) {
    const userId = req.user.userId;
    await this.authService.recoveryPassword(userId, recoveryPassword);
    return {message: 'Contraseña cambiado correctamente'}
  }
}
