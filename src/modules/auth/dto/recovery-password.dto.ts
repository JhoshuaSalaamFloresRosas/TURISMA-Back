import { IsString, IsNotEmpty } from 'class-validator';

export class RecoveryPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}