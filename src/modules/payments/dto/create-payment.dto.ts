export class CreatePaymentDto {
    reservationId: number;
    totalCost: number;
    partialPay?: boolean;
    status: boolean;
}
