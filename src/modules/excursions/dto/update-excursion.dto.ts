import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateExcursionDto } from './create-excursion.dto';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExcursionDto extends PartialType(CreateExcursionDto) {
  @ApiPropertyOptional({
    description: 'El nombre de la excursión',
    example: 'Excursión a la playa',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'La descripción de la excursión',
    example: 'Disfruta de un día relajante en una hermosa playa con actividades acuáticas.',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'La fecha de salida de la excursión',
    example: '2024-08-10T07:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de salida debe ser una fecha válida.' })
  departureDate?: Date;
  
  @ApiPropertyOptional({
    description: 'La fecha de llegada de la excursión',
    example: '2024-08-10T19:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de llegada debe ser una fecha válida.' })
  arrivalDate?: Date;
  
  @ApiPropertyOptional({
    description: 'El precio de la excursión',
    example: 75.00,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  price?: number;

  @ApiPropertyOptional({
    description: 'La duración de la excursión',
    example: '1 día',
  })
  @IsOptional()
  @IsString({ message: 'La duración debe ser una cadena de texto.' })
  duration?: string;
  
  @ApiPropertyOptional({
    description: 'El ID del transporte utilizado en la excursión',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del transporte debe ser un número.' })
  transportId?: number;

  @ApiPropertyOptional({
    description: 'El punto de salida de la excursión',
    example: '18.607030,-98.470523',
  })
  @IsOptional()
  @IsString({ message: 'El punto de salida debe ser una cadena de texto.' })
  outPoint?: string;

  @ApiPropertyOptional({
    description: 'El estado de la excursión',
    enum: StatusExcur,
    example: StatusExcur.PENDING,
  })
  @IsOptional()
  @IsEnum(StatusExcur, { message: 'El estado debe ser un valor válido del enumerado StatusExcur.' })
  status?: StatusExcur;
}
