import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {

  constructor(private prisma: PrismaService) {}

  async createComplete(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({
      data,
    })
  }

  async createPartial(data: Prisma.PaymentCreateInput): Promise<Payment> {

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
    const payment = await this.prisma.payment.findUnique({
      where:{
        id
      }
    })

    if(!payment){
      throw new NotFoundException('Pago no encontrado')
    }

    return this.prisma.payment.update({
      where: {
        id
      },
      data: {
        status: true
      }
    })
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
