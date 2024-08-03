import { Module } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ExcursionsController } from './excursions.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ExcursionsController],
  providers: [ExcursionsService, PrismaService],
})
export class ExcursionsModule {}
