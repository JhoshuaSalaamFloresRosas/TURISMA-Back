/**
 * DTO para actualizar el status de una excursion
 */
import {IsNotEmpty,  IsEnum } from 'class-validator';
import { StatusExcur } from '@prisma/client'; 

export class UpdateExcursionStatusDto {
    @IsNotEmpty({message: "El estado es obligatorio"})
    @IsEnum(StatusExcur, { message: 'El estado debe ser un valor válido del enumerado StatusExcur.' })
    status: StatusExcur;
}