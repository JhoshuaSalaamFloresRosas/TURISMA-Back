import { ApiProperty } from '@nestjs/swagger';

export class Reservation {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  excursionId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2024-08-10T07:00:00.000Z' })
  reservationDate: Date;
}
