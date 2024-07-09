import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/JwtStrategy.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/common/services/email.service';
import { SmsService } from 'src/common/services/sms.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Cambia esto a una variable de entorno en producción
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService, UsersService, EmailService, SmsService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
