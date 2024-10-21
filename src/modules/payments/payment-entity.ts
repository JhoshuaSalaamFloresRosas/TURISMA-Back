import { ApiProperty } from "@nestjs/swagger";
import { Payment } from "@prisma/client";

export class PaymentEntity implements Payment {
    
    @ApiProperty({ description: 'Identificador único para el pago'})
    id: number;

    @ApiProperty({ description: 'Identificador de la reserva asociada'})
    reservationId: number;

    @ApiProperty({ description: 'Fecha en la que se realizó el pago'})
    date: Date;

    @ApiProperty({ description: 'Costo total del pago'})
    totalCost: number;

    @ApiProperty({ description: 'Monto que ya ha sido pagado'})
    alreadyPay: number;

    @ApiProperty({ description: 'Indica si el pago fue parcial'})
    partialPay: boolean;

    @ApiProperty({ description: 'Estado del pago',})
    status: boolean;

    @ApiProperty({ description: 'Fecha en la que se completó el pago', required: false })
    dateCompleted: Date;

    @ApiProperty({ description: 'Referencia o ID de transacción del pago'})
    reference: string;
}