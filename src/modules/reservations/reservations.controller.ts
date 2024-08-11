import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Reservation } from './entities/reservation.entity';

@ApiBearerAuth()
@ApiTags('Reservaciones')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':excursionId')
  @ApiOperation({ summary: 'Crear una nueva reservación para una excursión' })
  @ApiCreatedResponse({ description: 'Reservación creada exitosamente.', type: String })
  create(@Param('excursionId') excursionId: string, @Req() req, @Body() createReservationDto: CreateReservationDto ) {
    const userId = req.user.userId;
    return this.reservationsService.create(userId, +excursionId, createReservationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservaciones del usuario autenticado' })
  @ApiOkResponse({ description: 'Listado de reservaciones del usuario.', type: Reservation })
  findAll(@Req() req) {
    const userId = req.user.userId;
    return this.reservationsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reservación específica por ID' })
  @ApiOkResponse({ description: 'Detalles de la reservación.', type: Reservation })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Public()
  @Get(':id/time-until-excursion')
  @ApiOperation({ summary: 'Obtener el tiempo restante hasta la fecha de salida de la excursión asociada a la reservación' })
  @ApiOkResponse({ description: 'Tiempo hasta la fecha de salida y si es posible cancelar la reservación.', type: Object })
  async getTimeUntilExcursion(@Param('id') id: string) {
    return this.reservationsService.getTimeUntilExcursion(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una reservación' })
  @ApiOkResponse({ description: 'Mensaje de confirmación de cancelación.', type: String })
  async cancelReservation(
    @Param('id') id: string, 
    @Body('email') email: string
  ) {
    return this.reservationsService.cancelReservation(+id, email);
  }
}
