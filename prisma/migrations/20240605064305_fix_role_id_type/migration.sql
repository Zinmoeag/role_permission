/*
  Warnings:

  - You are about to alter the column `role_id` on the `RolePermission` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RolePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_id" INTEGER NOT NULL,
    "permission_id" TEXT NOT NULL,
    CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("id", "permission_id", "role_id") SELECT "id", "permission_id", "role_id" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
CREATE UNIQUE INDEX "RolePermission_role_id_key" ON "RolePermission"("role_id");
PRAGMA foreign_key_check("RolePermission");
PRAGMA foreign_keys=ON;
