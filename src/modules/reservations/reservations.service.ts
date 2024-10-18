import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../../prisma.service';
import { Prisma, Reservation } from '@prisma/client';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class ReservationsService {

  constructor(private prisma: PrismaService,private emailService: EmailService) {}

  async getTimeUntilExcursion(reservationId: number): Promise<{ daysUntilExcursion: number, canCancel: boolean }> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { excursion: true }
    });

    if (!reservation) {
      throw new NotFoundException("Reservación no encontrada.");
    }

    const currentDate = new Date();
    const departureDate = reservation.excursion.departureDate;

    if (!departureDate) {
      throw new BadRequestException("La excursión no tiene una fecha de salida definida.");
    }

    const timeDifference = departureDate.getTime() - currentDate.getTime();
    const daysUntilExcursion = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return {
      daysUntilExcursion,
      canCancel: daysUntilExcursion > 12
    };
  }

  

  async create(userId: number, excursionId: number, createReservationDto: CreateReservationDto): Promise<{message: string}> {
    if (!createReservationDto.confirm) {
      throw new BadRequestException("Se requiere confirmacion");
    }

    const seatsToReserve = createReservationDto.seats;

    // Verificar la disponibilidad de los asientos
    const existingSeats = await this.prisma.seat.findMany({
      where: {
        reservation: {
          excursionId: excursionId
        },
        seatNumber: {
          in: seatsToReserve
        }
      }
    });

    if (existingSeats.length > 0) {
      throw new BadRequestException("Uno o más asientos ya están reservados.");
    }

    // Crear la reservación
    const reservation = await this.prisma.reservation.create({
      data: {
        userId: userId,
        excursionId: excursionId,
        seats: {
          create: seatsToReserve.map(seatNumber => ({
            seatNumber: seatNumber
          }))
        }
      }
    });

    // Obtener los detalles del usuario y la excursión
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const excursion = await this.prisma.excursion.findUnique({ where: { id: excursionId } });

    // Enviar correo electrónico con los detalles de la reservación
    await this.emailService.sendReservationDetails(user.email, excursion.name);

    return { message: "Reservación creada exitosamente." };
  }
  /**
   * Obtener reservaciones de un usuario
   * @param userId 
   * @returns s
   */
  async findAll(userId: number): Promise <Reservation[]> {
    const reservations = await this.prisma.reservation.findMany({
      where:{
        userId: userId
      },
      include:{
        payment: true,
        seats: true
      }
    });
    if(!reservations){
      throw new NotFoundException("Sin reservaciones");
    }
    return reservations;
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({where:{id: id}})
    if (!reservation){
      throw new NotFoundException("Reservación no encontrada");
    }
    return reservation;
  }


  async cancelReservation(reservationId: number, email: string): Promise<{ message: string }> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true, excursion: true, seats: true }
    });

    if (!reservation) {
      throw new NotFoundException("Reservación no encontrada.");
    }

    if (reservation.user.email !== email) {
      throw new UnauthorizedException("El correo electrónico no coincide con el del usuario.");
    }

    const { canCancel } = await this.getTimeUntilExcursion(reservationId);

    if (!canCancel) {
      throw new BadRequestException("No se puede cancelar la reservación porque faltan menos de 12 días para la fecha de salida.");
    }

    // Cambiar el estado de la reservación a CANCELED y eliminar los asientos reservados
    await this.prisma.$transaction([
      this.prisma.seat.deleteMany({
        where: { reservationId: reservationId }
      }),
      this.prisma.reservation.update({
        where: { id: reservationId },
        data: { statusReserv: 'CANCELED' }
      })
    ]);

    // Enviar correo electrónico de cancelación
    await this.emailService.sendCancellationEmail(reservation.user.email, reservation.excursion.name);

    return { message: "Reservación cancelada exitosamente." };
  }
}
