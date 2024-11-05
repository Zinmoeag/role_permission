/*
  Warnings:

  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RolePermission` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RolePermission" (
    "role_id" INTEGER NOT NULL,
    "permission_id" TEXT NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("permission_id", "role_id") SELECT "permission_id", "role_id" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
PRAGMA foreign_key_check("RolePermission");
PRAGMA foreign_keys=ON;
