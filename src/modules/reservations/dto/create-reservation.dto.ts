import { IsBoolean, IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateReservationDto { 

    @IsBoolean({message: "La confirmacion debe ser de tipo Boolean"})
    @IsNotEmpty({message: "La confirmacion es requerida"})
    confirm: boolean

    @IsArray({message: "Los asientos deben ser un arreglo"})
    @ArrayNotEmpty({message: "Debes seleccionar al menos un asiento"})
    seats: string[]
}
