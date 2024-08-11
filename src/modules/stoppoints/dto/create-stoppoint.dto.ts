import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStoppointDto {
  
  @ApiProperty({
    description: 'Latitud y longitud',
    example: '18.603974,-98.483315'
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
