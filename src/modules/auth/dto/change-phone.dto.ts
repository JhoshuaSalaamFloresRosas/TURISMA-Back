import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ChangePhoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPhone: string;

  @ApiProperty()
  @IsString({ message: 'El teléfono debe ser una cadena de caracteres.' })
  @Matches(/^[+]?[0-9]+$/, { message: 'El teléfono debe contener solo números y opcionalmente comenzar con "+".' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  newPhone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}