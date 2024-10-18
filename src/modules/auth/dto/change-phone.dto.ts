import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ChangePhoneDto {
  @ApiProperty({required: true, description: "Telefono antiguo"})
  @IsString()
  @IsNotEmpty()
  oldPhone: string;

  @ApiProperty({required: true, description: "Telefono nuevo"})
  @IsString({ message: 'El teléfono debe ser una cadena de caracteres.' })
  @Matches(/^\+[0-9]+$/, { message: 'El teléfono debe contener solo números y comenzar con "+".' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  newPhone: string;

  @ApiProperty({required: true, description: "Token de verificación"})
  @IsString()
  @IsNotEmpty()
  token: string;
}