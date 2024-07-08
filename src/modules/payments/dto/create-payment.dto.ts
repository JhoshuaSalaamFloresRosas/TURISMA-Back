export class CreatePaymentDto {
    reservationId: number;
    date?: Date;
    totalCost: number;
    alreadyPay?: number;
    partialPay?: boolean;
    status: boolean;
}
