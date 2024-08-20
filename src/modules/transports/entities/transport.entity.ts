import { ApiProperty } from "@nestjs/swagger";

export class Transport {
  
//Especificación de propiedades de cada entidad

  @ApiProperty()
  id: number;

  @ApiProperty({ description: "Marca del vehículo" })
  brand: string;

  @ApiProperty({ description: "Modelo del vehículo" })
  model: string;

  @ApiProperty({ description: "Tipo del vehículo"})
  type: string;

  @ApiProperty({ description: "Capacidad del vehículo"})
  capacity: number;
}
