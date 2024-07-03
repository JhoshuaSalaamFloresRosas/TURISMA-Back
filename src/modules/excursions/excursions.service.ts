import { Injectable, NotFoundException } from '@nestjs/common';
import { Excursion, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';


@Injectable()
export class ExcursionsService {

  constructor(private prisma: PrismaService) { }

  /**
   * funcion para comprobar existencia de excursion
   * @param id  
   */
  async byId(id: number) {
    const excursion = await this.prisma.excursion.findUnique({
      where: {
        id
      },
    });

    if (!excursion) {
      throw new NotFoundException('Excursion no encontrada')
    }

  }


// **************************************  Usuario 

  /**
   * Funcion para obtener todas las excursion para el listado principal
   * @returns 
   */
  async findAll(): Promise<any[]> {
    return this.prisma.excursion.findMany({
      select: {
        name: true,
        departureDate: true,
        price: true,
        status: true,
        photos: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
  }

  /**
   * Funcion para obtener la informacion de una sola excursion
   * @param id 
   * @returns 
   */
  async findOne(id: number): Promise<Excursion | null> {
    await this.byId(id);

    return this.prisma.excursion.findUnique({
      where: {
        id,
      },
      include: {
        photos: true,
        stopPoints: {
          include: {
            activities: true,
          },
        },
        transport: true,
      },
    });
  }

// ************************************* Admin

  

  /**
   * Funcion para crear excursion
   * @param excursion 
   * @returns 
   */
  async create(excursion: Prisma.ExcursionCreateInput): Promise<{ message: string }> {
    try {
      await this.prisma.excursion.create({
        data: excursion,
      });
      return { message: 'La excursión ha sido agregada exitosamente' };
    } catch (error) {
      throw new NotFoundException('Error al crear la excursión' + error);
    }
  }

  /**
   * Funcion para actualizar una excursion
   * @param id 
   * @param excursion 
   * @returns 
   */
  async update(id: number, excursion: Prisma.ExcursionUpdateInput): Promise<Excursion> {

    await this.byId(id);

    try {
      const excursionE = await this.prisma.excursion.update({
        data: excursion,
        where: {
          id
        }
      });
      return excursionE
    } catch (error) {
      throw new NotFoundException('Error al actualizar la excursión ' + error);
    }
  }

  /**
   * Funcion para actualizar solo estatus de una excursion
   * @param id 
   * @param UpdateExcursionStatusDto 
   * @returns 
   */
  async updateStatus(id: number, UpdateExcursionStatusDto: UpdateExcursionStatusDto): Promise<{ message: String }> {
    await this.byId(id);

    try {
      const excursion = await this.prisma.excursion.update({
        data: UpdateExcursionStatusDto,
        where: {
          id
        }
      });
      return { message: "El estatus fue cambiado exitosamente" }
    } catch (error) {
      throw new NotFoundException('Error al actualizar el estatus ' + error);
    }
  }


  /**
   * Funcion para obtener toda la info de una excursion 
   * @returns 
   */
  async findAllDetailed(id: number) {
    const excursions = await this.prisma.excursion.findMany({
      where:{
        id
      },
      include: {
        reservations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return excursions
    ;
  }

}
