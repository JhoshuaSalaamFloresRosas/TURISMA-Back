import { ApiProperty } from '@nestjs/swagger';

export class StopPoint {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Punto de parada 1' })
  name: string;

  @ApiProperty({ example: 1 })
  excursionId: number;
}
