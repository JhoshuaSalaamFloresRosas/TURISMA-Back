import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {

  constructor(private prisma: PrismaService) {}

  async createComplete(createPaymentDto: CreatePaymentDto) {
    // Verificar si la reservación existe
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: createPaymentDto.reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Crear el pago
    const payment = await this.prisma.payment.create({
      data: {
        reservation: { connect: { id: createPaymentDto.reservationId } },
        date: createPaymentDto.date,
        totalCost: createPaymentDto.totalCost,
        alreadyPay: createPaymentDto.alreadyPay,
        partialPay: createPaymentDto.partialPay,
        status: createPaymentDto.status,
      },
    });

    // Actualizar la reservación con el ID del pago creado
    await this.prisma.reservation.update({
      where: { id: createPaymentDto.reservationId },
      data: {
        paymentId: payment.id,
      },
    });

    return payment;
  }
  
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
  }
}
