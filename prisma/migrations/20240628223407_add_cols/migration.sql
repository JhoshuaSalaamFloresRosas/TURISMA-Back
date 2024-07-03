-- AlterTable
ALTER TABLE "Excursion" ADD COLUMN     "likes" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationToken" VARCHAR(120),
ALTER COLUMN "userPhoto" SET DEFAULT 'defaultUser.png';
