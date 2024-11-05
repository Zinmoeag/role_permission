-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "provider" TEXT DEFAULT 'LOCAL',
    "roleId" INTEGER NOT NULL DEFAULT 1,
    "verify" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT,
    "verificationCode_expried" DATETIME,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("role_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatar", "email", "id", "name", "password", "provider", "roleId", "verificationCode", "verificationCode_expried", "verify") SELECT "avatar", "email", "id", "name", "password", "provider", "roleId", "verificationCode", "verificationCode_expried", "verify" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_verificationCode_key" ON "User"("verificationCode");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
