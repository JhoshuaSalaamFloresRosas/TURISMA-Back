import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ required: false, description: "Nombre del usuario"})
    name:      string;

    @ApiProperty({ required: false, description: "Apellido del usuario"})
    lastName: string; 
}
