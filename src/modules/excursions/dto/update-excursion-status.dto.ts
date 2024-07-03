/**
 * DTO para actualizar el status de una excursion
 */
import {IsNotEmpty,  IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client'; 

export class UpdateExcursionStatusDto {
    @IsNotEmpty()
    @IsEnum(StatusExcur)
    status: StatusExcur;
}