import { Injectable } from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { Prisma, Transport } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransportsService {

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TransportCreateInput): Promise<Transport> {
    return this.prisma.transport.create({
      data
    });
  }

  findAll(): Promise<Transport[]> {
    return this.prisma.transport.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} transport`;
  }

  update(id: number, updateTransportDto: UpdateTransportDto) {
    return `This action updates a #${id} transport`;
  }


}