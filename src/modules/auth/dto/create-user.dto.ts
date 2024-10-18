import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({required: true, description: "Nombre del usuario"})
  @IsString({ message: 'El nombre debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({required: true, description: "Contraseña del usuario"})
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
    { message: 'La contraseña debe incluir al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.' })
  password: string;

  @ApiProperty({required: true, description: "Apellido del usuario"})
  @IsString({ message: 'El apelido debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @ApiProperty({ required: true, description: "Número telefónico del usuario" })
  @IsString({ message: 'El teléfono debe ser una cadena de caracteres.' })
  @Matches(/^\+[0-9]+$/, { message: 'El teléfono debe contener solo números y comenzar con "+".' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;


  @ApiProperty({required: true, description: "Correo electronico del usuario"})
  @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;
}
