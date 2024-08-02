import { Module } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ExcursionsController } from './excursions.controller';
import { PrismaService } from '../../prisma.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExcursionsController],
  providers: [ExcursionsService, PrismaService, RolesGuard],
})
export class ExcursionsModule {}
