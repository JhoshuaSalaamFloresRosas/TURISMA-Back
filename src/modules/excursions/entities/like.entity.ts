import { ApiProperty } from '@nestjs/swagger';

export class LikeEntity {
  @ApiProperty({
    description: 'ID único del like',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID de la excursión asociada con el like',
    example: 1,
  })
  excursionId: number;

  @ApiProperty({
    description: 'ID del usuario que dio el like',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Fecha de creación del like',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
