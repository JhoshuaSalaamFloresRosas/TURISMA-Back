import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, EmailService],
})
export class PaymentsModule {}
