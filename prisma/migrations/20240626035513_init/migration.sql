-- CreateEnum
CREATE TYPE "StatusReserv" AS ENUM ('COMPLETE', 'CANCELED', 'PENDING');

-- CreateEnum
CREATE TYPE "StatusExcur" AS ENUM ('PROCESS', 'FINISHED', 'CANCELED', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "firstName" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "userPhoto" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "excursion" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sitNumber" VARCHAR(50) NOT NULL,
    "payment" INTEGER NOT NULL,
    "statusReserv" "StatusReserv" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Excursion" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "price" INTEGER,
    "transport" INTEGER,
    "outPoint" VARCHAR(200),
    "sitApart" INTEGER,
    "status" "StatusExcur" NOT NULL,

    CONSTRAINT "Excursion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StopPoint" (
    "id" SERIAL NOT NULL,
    "excursion" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "numStop" INTEGER NOT NULL,
    "duration" VARCHAR(200) NOT NULL,

    CONSTRAINT "StopPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "stopPoint" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "numActivity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCost" INTEGER NOT NULL,
    "alreadyPay" INTEGER,
    "partialPay" BOOLEAN,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(120) NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "type" VARCHAR(120) NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "excursion" INTEGER NOT NULL,
    "imageUrl" VARCHAR(200) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_excursion_fkey" FOREIGN KEY ("excursion") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_payment_fkey" FOREIGN KEY ("payment") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excursion" ADD CONSTRAINT "Excursion_transport_fkey" FOREIGN KEY ("transport") REFERENCES "Transport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopPoint" ADD CONSTRAINT "StopPoint_excursion_fkey" FOREIGN KEY ("excursion") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stopPoint_fkey" FOREIGN KEY ("stopPoint") REFERENCES "StopPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_excursion_fkey" FOREIGN KEY ("excursion") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
