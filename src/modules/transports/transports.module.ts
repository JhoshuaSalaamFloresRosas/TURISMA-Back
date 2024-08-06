import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [TransportsController],
  providers: [TransportsService, PrismaService, RolesGuard],
})
export class TransportsModule {}
