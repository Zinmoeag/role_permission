/*
  Warnings:

  - You are about to drop the column `resoure` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `resource` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL
);
INSERT INTO "new_Permission" ("action", "id") SELECT "action", "id" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
PRAGMA foreign_key_check("Permission");
PRAGMA foreign_keys=ON;
