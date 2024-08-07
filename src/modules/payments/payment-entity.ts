import { ApiProperty } from "@nestjs/swagger";
import { Payment } from "@prisma/client";

export class PaymentEntity implements Payment {
    @ApiProperty()
    id: number;

    @ApiProperty()
    reservationId: number;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    totalCost: number;

    @ApiProperty()
    alreadyPay: number;

    @ApiProperty()
    partialPay: boolean;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    dateCompleted: Date;

    @ApiProperty()
    reference: string;
}