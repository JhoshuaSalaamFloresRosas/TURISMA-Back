/*
  Warnings:

  - You are about to drop the column `like` on the `Excursion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Excursion" DROP COLUMN "like",
ADD COLUMN     "likes" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "ExcursionLike" (
    "id" SERIAL NOT NULL,
    "excursionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ExcursionLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExcursionLike_excursionId_userId_key" ON "ExcursionLike"("excursionId", "userId");

-- AddForeignKey
ALTER TABLE "ExcursionLike" ADD CONSTRAINT "ExcursionLike_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "Excursion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursionLike" ADD CONSTRAINT "ExcursionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
