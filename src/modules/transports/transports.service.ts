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

  async findOne(id: number): Promise<Transport | null>{
    return  this.prisma.transport.findUnique({
      where:{id},
    }); 
  }

  async update(id: number, updateTransportDto: UpdateTransportDto):Promise<Transport | null>{
    return this.prisma.transport.update({
      where:{id},
      data: updateTransportDto,
    });
  }


  async remove(id: number): Promise<{success:boolean; message: string}> {
    try {
      // Verificar si el transporte tiene relaciones con excursiones
      const relatedExcursions = await this.prisma.excursion.findMany({
        where: {
          transportId: id,
        },
      });
  
      // Si hay registros relacionados, no permitir la eliminación
      if (relatedExcursions.length > 0) {
        return {
          success: false,
          message: 'El transporte no puede ser eliminado porque tiene relaciones con excursiones.'
        };
      }
  
      // Si no hay registros relacionados, permite la eliminación
      await this.prisma.transport.delete({
        where: {
          id
        }
      });
  
      return {
        success: true,
        message: 'Transporte eliminado exitosamente.'
      };
    } catch (error) {
      // Manejar cualquier error inesperado
      console.error('Error al eliminar el transporte:', error);
      return {
        success: false,
        message: 'Ocurrió un error al eliminar el transporte.'
      };
    }
  }
  


}