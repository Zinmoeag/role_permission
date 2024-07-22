/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_verify_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationCode_key" ON "User"("verificationCode");
