import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [AuthModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, PrismaService, RolesGuard, EmailService],
})
export class ReservationsModule {}
