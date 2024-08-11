import { Excursion, StatusExcur } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { Transport } from './transport.entity';
import { Reservation } from './reservation.entity';
import { StopPoint } from '../../stoppoints/entities/stoppoint.entity';
import { Photo } from './photo.entity';
import { LikeEntity } from '../entities/like.entity';

export class ExcursionEntity implements Excursion {
  @ApiProperty({
    description: 'ID único de la excursión',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la excursión',
    example: 'Excursión a la playa',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la excursión',
    example: 'Disfruta de un día relajante en una hermosa playa con actividades acuáticas.',
  })
  description: string;

  @ApiProperty({
    description: 'Fecha de salida de la excursión',
    example: '2024-08-10T07:00:00.000Z',
  })
  departureDate: Date;

  @ApiProperty({
    description: 'Fecha de llegada de la excursión',
    example: '2024-08-10T19:00:00.000Z',
  })
  arrivalDate: Date;

  @ApiProperty({
    description: 'Precio de la excursión',
    example: 75.00,
  })
  price: number;

  @ApiProperty({
    description: 'Duración de la excursión',
    example: '1 día',
  })
  duration: string;

  @ApiProperty({
    description: 'ID del transporte utilizado en la excursión',
    example: 1,
  })
  transportId: number;

  @ApiProperty({
    description: 'Punto de salida de la excursión',
    example: '18.607030,-98.470523',
  })
  outPoint: string;

  @ApiProperty({
    description: 'Estado de la excursión',
    enum: StatusExcur,
    example: StatusExcur.PENDING,
  })
  status: StatusExcur;

  @ApiProperty({
    description: 'Cantidad de "me gusta" de la excursión',
    example: 42,
  })
  likes: number;

  @ApiProperty({description:"Transporte asignado", type: () => Transport })
  transport: Transport;

  @ApiProperty({description:"Reservaciones", type: () => [Reservation] })
  reservations: Reservation[];

  @ApiProperty({description:"Paradas", type: () => [StopPoint] })
  stopPoints: StopPoint[];

  @ApiProperty({description:"Fotos", type: () => [Photo] })
  photos: Photo[];

  @ApiProperty({description:"Likes de la excursion", type: () => [LikeEntity] })
  likesList: LikeEntity[];

}
