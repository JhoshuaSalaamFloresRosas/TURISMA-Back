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

  async createComplete(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    })
  }

  async createPartial(data: Prisma.PaymentCreateInput): Promise<Payment> {

    //funcion para hacer el calculo por hacientos, aqui va a ir
    const alreadyPay = data.totalCost * 0.5;

    const newData: Prisma.PaymentCreateInput = {
      ...data,
      partialPay: true,
      alreadyPay: alreadyPay,
    };
  
    return this.prisma.payment.create({
      data: newData
    });
  }

  async updateStatus(id): Promise<Payment>{
    const user = await this.prisma.payment.findUnique({
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

    const email = user.reservation.user.email
    const excursion = user.reservation.excursion.name
    const stopPoints = user.reservation.excursion.stopPoints
    const departureDate = user.reservation.excursion.departureDate
    const outPoint = user.reservation.excursion.outPoint
    await this.emailService.sendVerificationPay(email, excursion, stopPoints, departureDate, outPoint);

    const payment = await this.prisma.payment.findUnique({
      where:{
        id
      }
    })

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

    const now = new Date();

    return this.prisma.payment.update({
      where: {
        id
      },
      data: {
        status: true,
        paymentCompleted: now
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
