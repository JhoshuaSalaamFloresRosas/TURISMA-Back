/*
  Warnings:

  - A unique constraint covering the columns `[reservationId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_paymentId_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "reservationId" INTEGER;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "paymentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_paymentId_key" ON "Reservation"("paymentId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
