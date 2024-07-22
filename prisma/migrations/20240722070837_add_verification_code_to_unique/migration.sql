/*
  Warnings:

  - A unique constraint covering the columns `[verify]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_verify_key" ON "User"("verify");
