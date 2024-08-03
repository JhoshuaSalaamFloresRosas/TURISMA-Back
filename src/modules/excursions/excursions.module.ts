import { Module } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ExcursionsController } from './excursions.controller';
<<<<<<< HEAD
import { PrismaService } from '../../prisma.service';
=======
import { PrismaService } from 'src/prisma.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
>>>>>>> 835d60e74efeca3ef6397c79a3504299909a0d83

@Module({
  imports: [AuthModule],
  controllers: [ExcursionsController],
  providers: [ExcursionsService, PrismaService, RolesGuard],
})
export class ExcursionsModule {}
