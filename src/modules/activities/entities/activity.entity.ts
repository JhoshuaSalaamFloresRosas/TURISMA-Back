import { ApiProperty } from "@nestjs/swagger";

export class Activity {
        @ApiProperty({ example: 'Nombre de la actividad' })
        name: string;
      
        @ApiProperty({ example: 1 })
        numActivity: number
      
        @ApiProperty({ example: 'Descripción de la actividad' })
        description: string
    }
