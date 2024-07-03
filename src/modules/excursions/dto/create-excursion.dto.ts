import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusExcur } from '@prisma/client';

export class CreateExcursionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalDate?: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsOptional()
  @IsNumber()
  transportId?: number;

  @IsOptional()
  @IsString()
  outPoint?: string;

  @IsOptional()
  @IsEnum(StatusExcur)
  status?: StatusExcur;

  @IsOptional()
  @IsNumber()
  like?: number;
}
