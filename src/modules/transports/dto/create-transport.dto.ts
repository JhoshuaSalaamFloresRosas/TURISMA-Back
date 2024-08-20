
//Especificación de endpoints
import { ApiProperty } from "@nestjs/swagger";


export class CreateTransportDto {

  //Propiedades
  @ApiProperty({ description: "Marca del vehículo" })
  brand: string;

  @ApiProperty({ description: "Modelo del vehículo" })
  model: string;

  @ApiProperty({ description: "Tipo del vehículo"})
  type: string;

  @ApiProperty({ description: "Capacidad del vehículo"})
  capacity: number;
}