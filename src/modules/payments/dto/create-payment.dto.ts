import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber({}, { message: 'El campo totalCost debe ser un número.' })
  @IsNotEmpty({ message: 'El campo totalCost no puede estar vacío.' })
  totalCost: number;
}
