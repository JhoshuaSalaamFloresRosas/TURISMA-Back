-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "statusReserv" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "actvie" BOOLEAN DEFAULT true;
