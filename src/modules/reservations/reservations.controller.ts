import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':excursionId')
  create(@Param('excursionId') excursionId: string, @Req() req, @Body() createReservationDto: CreateReservationDto ) {
    const userId = req.user.userId;
    return this.reservationsService.create(userId, +excursionId, createReservationDto);
  }

  /**
   * Obtener las reservaciones del usuario
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.reservationsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Public()
  @Get(':id/time-until-excursion')
  async getTimeUntilExcursion(@Param('id') id: string) {
    return this.reservationsService.getTimeUntilExcursion(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelReservation(
    @Param('id') id: string, 
    @Body('email') email: string
  ) {
    return this.reservationsService.cancelReservation(+id, email);
  }
}
