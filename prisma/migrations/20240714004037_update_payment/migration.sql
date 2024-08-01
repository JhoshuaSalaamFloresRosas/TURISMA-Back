/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_paymentId_fkey";

-- DropIndex
DROP INDEX "Reservation_paymentId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentCompleted" TIMESTAMP(3),
ADD COLUMN     "reference" VARCHAR(100),
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "alreadyPay" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "paymentId";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
