import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePhoneDto {
  @IsString()
  @IsNotEmpty()
  oldPhone: string;

  @IsString()
  @IsNotEmpty()
  newPhone: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}