import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
    { message: 'La contraseña debe incluir al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.' })
  password: string;

  @IsString({ message: 'El apelido debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @IsString({ message: 'El teléfono debe ser una cadena de caracteres.' })
  @Matches(/^[+]?[0-9]+$/, { message: 'El teléfono debe contener solo números y comenzar con "+".' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;
}
