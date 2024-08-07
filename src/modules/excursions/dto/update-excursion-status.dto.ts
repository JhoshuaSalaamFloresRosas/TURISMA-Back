import { IsNotEmpty, IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar el status de una excursion
 */
export class UpdateExcursionStatusDto {
  @ApiProperty({
    description: 'El estado de la excursión',
    enum: StatusExcur,
    example: StatusExcur.PENDING,
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(StatusExcur, { message: 'El estado debe ser un valor válido del enumerado StatusExcur.' })
  status: StatusExcur;
}