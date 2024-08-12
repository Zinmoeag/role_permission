-- AlterTable
ALTER TABLE "RoomUser" ADD COLUMN "created_At" DATETIME;
ALTER TABLE "RoomUser" ADD COLUMN "updated_At" DATETIME;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_At" DATETIME,
    "updated_At" DATETIME,
    "userId" TEXT,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("created_At", "id", "name", "updated_At", "userId") SELECT "created_At", "id", "name", "updated_At", "userId" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_key_check("Room");
PRAGMA foreign_keys=ON;
