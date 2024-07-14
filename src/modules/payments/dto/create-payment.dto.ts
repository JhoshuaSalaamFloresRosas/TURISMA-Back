import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber({}, { message: 'El campo totalCost debe ser un número.' })
  @IsNotEmpty({ message: 'El campo totalCost no puede estar vacío.' })
  totalCost: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo partialPay debe ser un valor booleano.' })
  partialPay?: boolean;

  @IsBoolean({ message: 'El campo status debe ser un valor booleano.' })
  @IsNotEmpty({ message: 'El campo status no puede estar vacío.' })
  status: boolean;
}
