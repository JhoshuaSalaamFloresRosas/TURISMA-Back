/*
  Warnings:

  - You are about to drop the column `paymentCompleted` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentCompleted",
ADD COLUMN     "dateCompleted" TIMESTAMP(3),
ALTER COLUMN "partialPay" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT false;
