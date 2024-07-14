import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ChangePhoneDto {
  @IsString()
  @IsNotEmpty()
  oldPhone: string;

  @IsString({ message: 'El teléfono debe ser una cadena de caracteres.' })
  @Matches(/^[+]?[0-9]+$/, { message: 'El teléfono debe contener solo números y opcionalmente comenzar con "+".' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  newPhone: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}