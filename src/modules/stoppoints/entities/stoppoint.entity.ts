import { ApiProperty } from '@nestjs/swagger';

export class StopPoint {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Calle de los textiles' })
  name: string;

  @ApiProperty({ example: 1 })
  excursionId: number;
}
