import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Public } from '../../common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RegisterResponseDto } from './auth-entity';
import { LoginDTO } from './dto/login.dto';
import { LoginResponse } from './login-response';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @ApiOperation({ summary: 'Iniciar sesion.' })
  @ApiOkResponse({ type: LoginResponse })
  @Public()
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('/login')
  async login(@Request() req, @Body() Credential: LoginDTO) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Registra un nuevo usuario.' })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return { message: 'Correo electrónico de verificación enviado. Por favor, revisa tu bandeja de entrada.' };
  }

  @ApiOperation({ summary: "Valida el correo electronico del usuario nuevo." })
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Correo electrónico verificado con éxito.', },
      },
    },
  })
  @Public()
  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string) {
    const isValid = await this.authService.verifyEmail(token);
    if (!isValid) {
      throw new BadRequestException('Token de verificación no válido o caducado.');
    }
    return { message: 'Correo electrónico verificado con éxito.' };
  }

  @ApiOperation({summary: "Actualizar datos del usuario."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Usuario actualizado.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    await this.usersService.update(userId, updateUserDto);
    return { message: 'Usuario actualizado.' }
  }

  @ApiOperation({summary: "Envio de token para actualizar contraseña mediante email | sms."})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          enum: ['email', 'sms'],
          example: 'email',
          description: 'Método de envío del código de verificación. Puede ser "email" o "sms".',
        },
      },
      required: ['method'],
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Código de verificación enviado correctamente.',
        },
      },
    },
  })
  //@UseGuards(JwtAuthGuard)
  @Public()
  @Post('send-verification')
  async sendVerification(@Body('method') method: 'email' | 'sms', @Body('contacto') contacto: string) {
    await this.authService.sendVerification(contacto, method);
    return { message: 'Código de verificación enviado correctamente.' };
  }

  @ApiOperation({summary: "Cambiar contraseña."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Contraseña cambiada correctamente.', },
      },
    },
  })
  @Public()
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Body('email') email: string) {
    //const userId = req.user.userId;
    await this.authService.changePassword(email, changePasswordDto);
    return { message: 'Contraseña cambiada correctamente.' };
  }
  
  @Public()
  @Patch('verify-token')
  async verifyToken(@Body('token') token: string, @Body('email') email: string) {
    // Paso 1: Verificar el token
    const isTokenValid = await this.authService.verifyTokenForPasswordReset(email, token);

    if (!isTokenValid) {
      throw new BadRequestException('Token de verificación no válido');
    }

  // Si el token es válido, responder indicando que es correcto y permitir cambiar la contraseña
  return { message: 'Token válido, puede cambiar la contraseña ahora.' };
}

  @ApiOperation({summary: "Eliminar un usuario."})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Se requiere proporcionar un correo electrónico para la eliminación.',
        },
      },
      required: ['email'],
    },
  })
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Usuario eliminado correctamente.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteUser(@Request() req, @Body() body: { email: string }) {
    const userId = req.user.userId;
    const providedEmail = body.email;

    if (!providedEmail) {
      throw new BadRequestException('Se requiere proporcionar un correo electrónico para la eliminación.');
    }

    return this.usersService.deleteUser(userId, providedEmail);
  }

  @ApiOperation({summary: "Envio de token para un cambio de telefono."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Código de verificación enviado correctamente.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/send-verification-Phone')
  async sendVerificationPhone(@Request() req) {
    const userId = req.user.userId;
    await this.authService.sendVerificationPhone(userId);
    return { message: 'Código de verificación enviado correctamente.' };
  }

  @ApiOperation({summary: "Cambiar telefono."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Telefono cambiado correctamente.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/update-phone')
  async updatePhone(@Request() req, @Body() changePhone: ChangePhoneDto) {
    const userId = req.user.userId;
    await this.authService.changePhone(userId, changePhone);
    return { message: 'Telefono cambiado correctamente.' }
  }

  @ApiOperation({summary: "Envio de token para un cambio de contraseña si se olvido."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Código de verificación enviado correctamente.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/send-verification-recovery')
  async sendVerificationPasswordRecovery(@Request() req,) {
    const userId = req.user.userId;
    await this.authService.sendVerificationPasswordRecovery(userId);
    return { message: 'Código de verificación enviado correctamente' };
  }

  @ApiOperation({summary: "Cambiar contraña por metodo de (Olvide mi contraseña)."})
  @ApiOkResponse({
    schema:
    {
      type: 'object',
      properties: {
        message:
          { type: 'string', example: 'Contraseña cambiado correctamente.', },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/password-recovery')
  async passwordRecovery(@Request() req, @Body() recoveryPassword: RecoveryPasswordDto) {
    const userId = req.user.userId;
    await this.authService.recoveryPassword(userId, recoveryPassword);
    return { message: 'Contraseña cambiado correctamente' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getuser')
  async getUser(@Request() req){
    const userId = req.user.userId
    const user = await this.authService.getUser(userId)
    return user
  }
}
