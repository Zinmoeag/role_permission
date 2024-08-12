-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_At" DATETIME NOT NULL,
    "updated_At" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomUser" (
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("room_id", "user_id"),
    CONSTRAINT "RoomUser_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoomUser_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
