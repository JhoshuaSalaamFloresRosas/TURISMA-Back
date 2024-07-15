import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoppointDto } from './dto/create-stoppoint.dto';
import { UpdateStoppointDto } from './dto/update-stoppoint.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, StopPoint } from '@prisma/client';

@Injectable()
export class StoppointsService {
  constructor (private prisma: PrismaService) {}

  async create(id: number, createStoppointDto: CreateStoppointDto): Promise<StopPoint>{
    const excursion = await this.prisma.excursion.findUnique({
      where: {id:id},
    })

    if(!excursion){
      throw new NotFoundException('Excursion no encontrada');
    }

    const newData: Prisma.StopPointCreateInput ={
      name: createStoppointDto.name,
      numStop: createStoppointDto.numStop,
      duration: createStoppointDto.duration,
      excursion: {connect: {id:id}}
    }

    return this.prisma.stopPoint.create({
      data: newData
    })
  }

  findAll(): Promise<any[]> {
    return this.prisma.stopPoint.findMany({
    })
  }

  async findOne(id: number) {
    const stopPoint = await this.prisma.stopPoint.findUnique({
      where:{
        id:id
      }
    })
    
    return stopPoint
  }

  async update(id: number, updateStoppointDto: UpdateStoppointDto): Promise<StopPoint> {
    return this.prisma.stopPoint.update({
      where:{
        id:id
      },
      data: updateStoppointDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} stoppoint`;
  }
}
