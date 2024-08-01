import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateStoppointDto {
    @IsNotEmpty({message: 'el campo nombre no puede estar vacio'})
    name:        string;

    @IsNotEmpty({message: 'el campo numero de parada no puede estar vacio'})
    @IsNumber({}, {message: 'el campo es de tipo numerico'})
    numStop:     number;

    @IsNotEmpty({message: 'el campo nombre no puede estar vacio'})
    duration:    string
}
