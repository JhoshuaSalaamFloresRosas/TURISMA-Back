import { BadRequestException, Body, Controller, Get, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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
    const { user } = req;
    
    // Verificar si el correo electrónico está verificado
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('El correo electrónico no ha sido verificado.');
    }
    
    // Si el correo está verificado, proceder con el inicio de sesión
    return this.authService.login(user);
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
}
