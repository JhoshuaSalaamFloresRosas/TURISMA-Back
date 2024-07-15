import { Module } from '@nestjs/common';
import { StoppointsService } from './stoppoints.service';
import { StoppointsController } from './stoppoints.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StoppointsController],
  providers: [StoppointsService, PrismaService],
})
export class StoppointsModule {}
