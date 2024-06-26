import { Module } from '@nestjs/common';
import { StoppointsService } from './stoppoints.service';
import { StoppointsController } from './stoppoints.controller';

@Module({
  controllers: [StoppointsController],
  providers: [StoppointsService],
})
export class StoppointsModule {}
