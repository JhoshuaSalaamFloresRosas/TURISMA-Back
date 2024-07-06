import { Module } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ExcursionsController } from './excursions.controller';
import { PrismaService } from 'src/prisma.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExcursionsController],
  providers: [ExcursionsService, PrismaService,RolesGuard],
})
export class ExcursionsModule {}
