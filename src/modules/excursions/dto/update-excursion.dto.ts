import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateExcursionDto } from './create-excursion.dto';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional,IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client';

export class UpdateExcursionDto extends PartialType(CreateExcursionDto) {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    departureDate?: Date;

    @IsOptional()
    @IsString()
    outPoint?: string;

    @IsOptional()
    @IsEnum(StatusExcur)
    status?: StatusExcur;

}
