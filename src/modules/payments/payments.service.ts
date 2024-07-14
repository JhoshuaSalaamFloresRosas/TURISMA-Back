import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';
import { Payment, Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class PaymentsService {

  constructor(private prisma: PrismaService,
              private emailService: EmailService
  ) {}

  async createComplete(id: number, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Buscar la reserva usando el ID proporcionado
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: id },
      include: {
        excursion: true,
        user: true
      }
    });

    if (!reservation) {
      throw new NotFoundException('Reservación no encontrada');
    }

    // Obtener detalles de la reserva
    const excursionId = reservation.excursion.id;
    const userId = reservation.user.id;
    const reservationId = reservation.id;
    const day = String(reservation.date.getDate()).padStart(2, '0'); // Obtener el día del mes con dos dígitos
    const month = String(reservation.date.getMonth() + 1).padStart(2, '0'); // Mes en JavaScript es 0-based
    const year = reservation.date.getFullYear(); // Obtener el año

    // Crear una referencia para el pago
    const reference = `${excursionId}-${userId}-${reservationId}-${day}-${month}-${year}`;

    // Preparar los datos del nuevo pago
    const newData: Prisma.PaymentCreateInput = {
      totalCost: createPaymentDto.totalCost,
      partialPay: createPaymentDto.partialPay,
      status: createPaymentDto.status,
      reference: reference,
      reservation: { connect: { id: id } } // Conectar la reserva usando el ID
    };

    // Crear el nuevo pago en la base de datos
    return this.prisma.payment.create({
      data: newData
    });
  }

  async createPartial(id: number, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Buscar la reserva usando el ID proporcionado
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: id },
      include: {
        excursion: true,
        user: true
      }
    });

    if (!reservation) {
      throw new NotFoundException('Reservación no encontrada');
    }

    // Obtener detalles de la reserva
    const excursionId = reservation.excursion.id;
    const userId = reservation.user.id;
    const reservationId = reservation.id;
    const day = String(reservation.date.getDate()).padStart(2, '0'); // Obtener el día del mes con dos dígitos
    const month = String(reservation.date.getMonth() + 1).padStart(2, '0'); // Mes en JavaScript es 0-based
    const year = reservation.date.getFullYear(); // Obtener el año

    // Crear una referencia para el pago
    const reference = `${excursionId}-${userId}-${reservationId}-${day}-${month}-${year}`;

    //funcion para hacer el calculo por hacientos, aqui va a ir
    const alreadyPay = createPaymentDto.totalCost * 0.5;

    const newData: Prisma.PaymentCreateInput = {
      totalCost: createPaymentDto.totalCost,
      partialPay: true,
      alreadyPay: alreadyPay,
      status: createPaymentDto.status,
      reference: reference,
      reservation: { connect: { id: id } } // Conectar la reserva usando el ID
    };
  
    return this.prisma.payment.create({
      data: newData
    });
  }

  async updateStatus(id): Promise<Payment>{
    const payment = await this.prisma.payment.findUnique({
      where: { id: id },
      include: {
        reservation: {
          include: {
            user: true,
            excursion: {
              include: {
                stopPoints: true
              }
            } // Incluye la información del usuario asociado
          },
        },
      },
    });

    const email = payment.reservation.user.email
    const excursion = payment.reservation.excursion.name
    const stopPoints = payment.reservation.excursion.stopPoints
    const departureDate = payment.reservation.excursion.departureDate
    const outPoint = payment.reservation.excursion.outPoint
    await this.emailService.sendVerificationPay(email, excursion, stopPoints, departureDate, outPoint);

    if(!payment){
      throw new NotFoundException('Pago no encontrado')
    }

    await this.prisma.reservation.update({
      where: {
        id: payment.reservationId,
      },
      data: {
        statusReserv: 'COMPLETE',
      },
    });

    return this.prisma.payment.update({
      where: {
        id
      },
      data: {
        status: true,
        paymentCompleted: new Date()
      }
    })
  }

  async updateReservationStatus() {
    try {
      // Obtén la fecha y hora actuales
      const now = new Date();

      // Obtén los pagos que fueron creados hace más de 48 horas y cuya reserva está en 'PENDING'
      const payments = await this.prisma.payment.findMany({
        where: {
          date: {
            lte: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 48 horas en milisegundos
          },
          reservation: {
            statusReserv: 'PENDING',
          },
        },
        include: {
          reservation: true,
        },
      });

      // Actualiza el estado de la reserva a 'CANCELED'
      for (const payment of payments) {
        await this.prisma.reservation.update({
          where: {
            id: payment.reservationId,
          },
          data: {
            statusReserv: 'CANCELED',
          },
        });

        console.log(`Reservation ID ${payment.reservationId} updated to CANCELED.`);
      }
    } catch (error) {
      console.error('Error updating reservation statuses:', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    console.log('Running the updateReservationStatus function.');
    this.updateReservationStatus();
  }

  /*
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }*/
}
