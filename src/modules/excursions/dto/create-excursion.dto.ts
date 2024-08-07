import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusExcur } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExcursionDto {
  @ApiProperty({
    description: 'El nombre de la excursión',
    example: 'Excursión a la playa',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name: string;

  @ApiProperty({
    description: 'La descripción de la excursión',
    example: 'Disfruta de un día relajante en una hermosa playa con actividades acuáticas.',
  })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description: string;

  @ApiPropertyOptional({
    description: 'La fecha de salida de la excursión',
    example: '2024-08-10T07:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de salida debe ser una fecha válida.' })
  departureDate?: Date;

  @ApiPropertyOptional({
    description: 'La fecha de llegada de la excursión',
    example: '2024-08-10T19:00:00.000Z',
    type: String,
    format: 'date-time',
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

  @ApiProperty({
    description: 'La duración de la excursión',
    example: '1 día',
  })
  @IsNotEmpty({ message: 'La duración es obligatoria.' })
  @IsString({ message: 'La duración debe ser una cadena de texto.' })
  duration: string;

  @ApiPropertyOptional({
    description: 'El ID del transporte',
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
  })
  @IsOptional()
  @IsEnum(StatusExcur, { message: 'El estado debe ser un valor válido del enumerado StatusExcur.' })
  status?: StatusExcur;
}
