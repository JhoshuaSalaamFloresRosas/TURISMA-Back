import { Module } from '@nestjs/common';
import { TransportsService } from './transports.service';
import { TransportsController } from './transports.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TransportsController],
  providers: [TransportsService,PrismaService],
})
export class TransportsModule {}
