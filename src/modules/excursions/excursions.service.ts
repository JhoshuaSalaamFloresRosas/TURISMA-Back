import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Excursion, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
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

    return excursion;

  }


  // **************************************  Usuario 

  /**
   * Funcion para obtener todas las excursion para el listado principal
   * @returns 
   */
  async findAll(): Promise<any[]> {
    return this.prisma.excursion.findMany({
      select: {
        id: true,
        name: true,
        departureDate: true,
        price: true,
        status: true,
        likes: true,
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
        reservations: {
          include: {
            seats: true
          }
        }
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
        data: {
          name: excursion.name,
          description: excursion.description,
          departureDate: excursion.departureDate,
          arrivalDate: excursion.arrivalDate,
          price: excursion.price,
          duration: excursion.duration,
          transport: excursion.transport,
          outPoint: excursion.outPoint,
          status: excursion.status,
        },
      });
      return { message: 'La excursión ha sido agregada exitosamente' };
    } catch (error) {
      throw new NotFoundException('Error al crear la excursión');
    }
  }
  
  /**
     * Funcion para actualizar una excursion
     * @param id
     * @param excursion
     * @returns
     */
  async update(id: number, excursion: Prisma.ExcursionUpdateInput): Promise<Excursion> {
    const Excursion = await this.prisma.excursion.findUnique({
      where: { id },
    });

    await this.byId(id);

    if (Excursion.status !== "LISTED" && Excursion.status !== "PENDING") {
      throw new BadRequestException('Solo excursiones listadas o pendientes pueden ser actualizadas');
    }

    try {
      const excursionE = await this.prisma.excursion.update({
        data: {
          name: excursion.name,
          description: excursion.description,
          departureDate: excursion.departureDate,
          arrivalDate: excursion.arrivalDate,
          price: excursion.price,
          duration: excursion.duration,
          transport: excursion.transport,
          outPoint: excursion.outPoint,
          status: excursion.status,
        },
        where: {
          id,
        },
      });
      return excursionE;
    } catch (error) {
      throw new NotFoundException('Error al actualizar la excursión');
    }
  }



  /**
     * Funcion para actualizar solo estatus de una excursion
     * @param id 
     * @param UpdateExcursionStatusDto 
     * @returns 
     */
  async updateStatus(id: number, UpdateExcursionStatusDto: UpdateExcursionStatusDto): Promise<{ message: string }> {
    const existingExcursion = await this.byId(id);

    if (!existingExcursion) {
      throw new NotFoundException('Excursión no encontrada');
    }

    const validStatuses = ['LISTED', 'FINISHED'];
    if (!validStatuses.includes(existingExcursion.status)) {
      throw new ForbiddenException('Solo se pueden actualizar excursiones listadas o finalizadas');
    }


    const newStatus = UpdateExcursionStatusDto.status;
    if (!newStatus || !validStatuses.includes(newStatus)) {
      throw new ForbiddenException('El nuevo estado no es válido');
    }

    if (existingExcursion.status === 'LISTED' && newStatus !== 'FINISHED') {
      throw new ForbiddenException('Solo se puede cambiar el estado de LISTED a FINISHED');
    }

    if (existingExcursion.status === 'FINISHED' && newStatus !== 'LISTED') {
      throw new ForbiddenException('Solo se puede cambiar el estado de FINISHED a LISTED');
    }

    try {
      const excursion = await this.prisma.excursion.update({
        data: {
          status: newStatus,
        },
        where: {
          id
        }
      });
      return { message: 'El estatus fue cambiado exitosamente' };
    } catch (error) {
      throw new NotFoundException('Error al actualizar el estatus');
    }
  }


  /**
   * Funcion para obtener toda la info de una excursion 
   * @returns 
   */
  async findAllDetailed(id: number) {
    const excursions = await this.prisma.excursion.findMany({
      where: {
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

  /**
   * Función para cancelar una excursión.
   * @param id - ID de la excursión a cancelar.
   * @returns Un mensaje indicando si la excursión fue cancelada.
   */
  async cancelExcursion(id: number): Promise<{ message: string }> {
    const excursion = await this.byId(id);


    if (excursion.status !== 'PENDING') {
      throw new ConflictException('Solo las excursiones pendientes pueden ser canceladas');
    }

    // Verificar si la excursión tiene reservas
    const reservationsCount = await this.prisma.reservation.count({
      where: {
        excursionId: id,
      },
    });

    if (reservationsCount > 0) {
      throw new ConflictException('No se puede cancelar una excursión que tiene reservaciones');
    }

    // Cancelar la excursión
    await this.prisma.excursion.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELED',
      },
    });

    return { message: 'La excursión ha sido cancelada exitosamente' };
  }

  async toggleLike(excursionId: number, userId: number): Promise<{ message: string }> {
    const like = await this.prisma.excursionLike.findUnique({
      where: {
        excursionId_userId: { excursionId, userId }
      }
    });

    if (like) {
      await this.prisma.excursionLike.delete({
        where: {
          id: like.id
        }
      });
      await this.prisma.excursion.update({
        where: { id: excursionId },
        data: {
          likes: {
            decrement: 1
          }
        }
      });
      return { message: 'Like removido' };
    } else {
      await this.prisma.excursionLike.create({
        data: {
          excursionId,
          userId
        }
      });
      await this.prisma.excursion.update({
        where: { id: excursionId },
        data: {
          likes: {
            increment: 1
          }
        }
      });
      return { message: 'Like agregado' };
    }
  }

}
