import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateExcursionDto } from './create-excursion.dto';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client';

export class UpdateExcursionDto extends PartialType(CreateExcursionDto) {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de salida debe ser una fecha válida.' })
  departureDate?: Date;
  
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de llegada debe ser una fecha válida.' })
  arrivalDate?: Date;
  
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número.' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'La duración debe ser una cadena de texto.' })
  duration: string;
  
  @IsOptional()
  @IsNumber({}, { message: 'El ID del transporte debe ser un número.' })
  transportId?: number;

  @IsOptional()
  @IsString({ message: 'El punto de salida debe ser una cadena de texto.' })
  outPoint?: string;

  @IsOptional()
  @IsEnum(StatusExcur, { message: 'El estado debe ser un valor válido del enumerado StatusExcur.' })
  status?: StatusExcur;
}
