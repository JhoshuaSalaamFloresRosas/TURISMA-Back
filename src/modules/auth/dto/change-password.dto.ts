import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString({ message: 'La contraseña debe ser una cadena de caracteres.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/(?=.*[a-z])/, { message: 'La contraseña debe incluir al menos una letra minúscula.' })
  @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe incluir al menos una letra mayúscula.' })
  @Matches(/(?=.*\d)/, { message: 'La contraseña debe incluir al menos un número.' })
  @Matches(/(?=.*[@$!%*?&])/, { message: 'La contraseña debe incluir al menos un carácter especial.' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}