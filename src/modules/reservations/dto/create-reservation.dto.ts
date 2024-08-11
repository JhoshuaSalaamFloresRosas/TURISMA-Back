import { IsBoolean, IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto { 

    @ApiProperty({
        description: 'Confirmación de la reservación. Debe ser un valor booleano.',
        example: true,
        required: true,
        type: Boolean,
    })
    @IsBoolean({ message: "La confirmación debe ser de tipo Boolean" })
    @IsNotEmpty({ message: "La confirmación es requerida" })
    confirm: boolean;

    @ApiProperty({
        description: 'Arreglo de asientos seleccionados para la reservación. Debe contener al menos un asiento.',
        example: ['A1', 'B2'],
        required: true,
        type: [String],
    })
    @IsArray({ message: "Los asientos deben ser un arreglo" })
    @ArrayNotEmpty({ message: "Debes seleccionar al menos un asiento" })
    seats: string[];
}
