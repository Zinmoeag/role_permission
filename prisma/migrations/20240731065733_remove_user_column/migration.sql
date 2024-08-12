/*
  Warnings:

  - You are about to drop the column `userId` on the `Room` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_At" DATETIME,
    "updated_At" DATETIME
);
INSERT INTO "new_Room" ("created_At", "id", "name", "updated_At") SELECT "created_At", "id", "name", "updated_At" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_key_check("Room");
PRAGMA foreign_keys=ON;
