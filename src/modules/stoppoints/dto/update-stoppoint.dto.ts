import { PartialType } from '@nestjs/mapped-types';
import { CreateStoppointDto } from './create-stoppoint.dto';
import { IsNotEmpty, IsNumber } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoppointDto extends PartialType(CreateStoppointDto) {
    @ApiProperty({
        description: 'Nombre de la parada',
        example: 'Oxxo'
      })
      @IsNotEmpty({message: 'el campo nombre no puede estar vacio'})
      name: string;
    
      @ApiProperty({
        description: 'Número de la parada',
        example: 1
      })
      @IsNotEmpty({message: 'el campo numero de parada no puede estar vacio'})
      @IsNumber({}, {message: 'el campo es de tipo numerico'})
      numStop: number;
    
      @ApiProperty({
        description: 'Duración de la parada',
        example: '3 horas'
      })
      @IsNotEmpty({message: 'el campo nombre no puede estar vacio'})
      duration: string;
    }
