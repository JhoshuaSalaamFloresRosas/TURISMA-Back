import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
    @ApiProperty({ required: true, description: "Nombre de la actividad" })
    @IsNotEmpty({message: 'El campo nombre no puede estar vacio'})
    name:      string 

    @ApiProperty({ required: true, description: "Número de la actividad" })
    @IsNotEmpty({message: 'El campo número de actividad no puede estar vacío'})
    @IsNumber({}, {message: 'El campo es de tipo numerico'})
    numActivity: number

    @ApiProperty({ required: true, description: "Descripción de la actividad" })
    @IsNotEmpty({message: 'El campo descripción no puede estar vacío'})
    description: string
}
