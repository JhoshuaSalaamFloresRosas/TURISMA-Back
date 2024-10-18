/*
  Warnings:

  - The values [PROCESS] on the enum `StatusExcur` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `stopPoint` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `sitApart` on the `Excursion` table. All the data in the column will be lost.
  - You are about to drop the column `transport` on the `Excursion` table. All the data in the column will be lost.
  - You are about to drop the column `excursion` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `excursion` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `sitNumber` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `excursion` on the `StopPoint` table. All the data in the column will be lost.
  - Added the required column `stopPointId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Excursion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Excursion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excursionId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excursionId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excursionId` to the `StopPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusExcur_new" AS ENUM ('LISTED', 'FINISHED', 'CANCELED', 'PENDING');
ALTER TABLE "Excursion" ALTER COLUMN "status" TYPE "StatusExcur_new" USING ("status"::text::"StatusExcur_new");
ALTER TYPE "StatusExcur" RENAME TO "StatusExcur_old";
ALTER TYPE "StatusExcur_new" RENAME TO "StatusExcur";
DROP TYPE "StatusExcur_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_stopPoint_fkey";

-- DropForeignKey
ALTER TABLE "Excursion" DROP CONSTRAINT "Excursion_transport_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_excursion_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_excursion_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_payment_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_user_fkey";

-- DropForeignKey
ALTER TABLE "StopPoint" DROP CONSTRAINT "StopPoint_excursion_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "stopPoint",
ADD COLUMN     "stopPointId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Excursion" DROP COLUMN "sitApart",
DROP COLUMN "transport",
ADD COLUMN     "description" VARCHAR(200) NOT NULL,
ADD COLUMN     "duration" VARCHAR(120) NOT NULL,
ADD COLUMN     "like" INTEGER DEFAULT 0,
ADD COLUMN     "transportId" INTEGER,
ALTER COLUMN "departureDate" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "excursion",
ADD COLUMN     "excursionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "excursion",
DROP COLUMN "payment",
DROP COLUMN "sitNumber",
DROP COLUMN "user",
ADD COLUMN     "excursionId" INTEGER NOT NULL,
ADD COLUMN     "paymentId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StopPoint" DROP COLUMN "excursion",
ADD COLUMN     "excursionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "seatNumber" VARCHAR(50) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excursion" ADD CONSTRAINT "Excursion_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopPoint" ADD CONSTRAINT "StopPoint_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stopPointId_fkey" FOREIGN KEY ("stopPointId") REFERENCES "StopPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
