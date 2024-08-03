import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
<<<<<<< HEAD
import { PrismaService } from '../../prisma.service';
=======
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
>>>>>>> 835d60e74efeca3ef6397c79a3504299909a0d83

@Module({
  imports: [AuthModule],
  controllers: [TransportsController],
  providers: [TransportsService, PrismaService, RolesGuard],
})
export class TransportsModule {}
