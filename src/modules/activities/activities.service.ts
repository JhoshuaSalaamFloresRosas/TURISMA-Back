import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { Activity, Prisma } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor (private prisma: PrismaService) {}

  async create(id: number, createActivityDto: CreateActivityDto): Promise<Activity>{
    const stoppoint = await this.prisma.stopPoint.findUnique({
      where:{
        id: id
      }
    })

    if(!stoppoint){
      throw new NotFoundException ({message: 'Parada no encontrada'});
    }

    const newData: Prisma.ActivityCreateInput = {
      name: createActivityDto.name,
      numActivity: createActivityDto.numActivity,
      description: createActivityDto.description,
      stopPoint: {connect: {id:id}}
    }

    return this.prisma.activity.create({
      data: newData
    })
  }

  findAll(): Promise<any[]> {
    return this.prisma.activity.findMany()
  }

  async findOne(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where:{
        id:id
      }
    })

    return activity
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    return this.prisma.activity.update({
      where:{
        id:id
      },
      data: updateActivityDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
