import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ExcursionsModule } from './modules/excursions/excursions.module';
import { TransportsModule } from './modules/transports/transports.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { PhotosModule } from './modules/photos/photos.module';
import { StoppointsModule } from './modules/stoppoints/stoppoints.module';
import { ActivitiesModule } from './modules/activities/activities.module';

@Module({
  imports: [UsersModule, ReservationsModule, ExcursionsModule, TransportsModule, PaymentsModule, AuthModule, PhotosModule, StoppointsModule, ActivitiesModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    AppService,],
})
export class AppModule {}
