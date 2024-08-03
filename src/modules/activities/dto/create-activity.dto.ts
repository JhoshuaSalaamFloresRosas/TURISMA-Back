import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateActivityDto {
    @IsNotEmpty({message: 'el campo nombre no puede estar vacio'})
    name:      string 

    @IsNotEmpty({message: 'el campo numero de actividad no puede estar vacio'})
    @IsNumber({}, {message: 'el campo es de tipo numerico'})
    numActivity: number

    @IsNotEmpty({message: 'el campo descripcion no puede estar vacio'})
    description: string
}
