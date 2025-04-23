-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "telegramId" INTEGER NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT,
    "firstName" TEXT,
    "photoUrl" TEXT,
    "balance" REAL DEFAULT 0
);
INSERT INTO "new_User" ("firstName", "id", "lastName", "photoUrl", "telegramId", "username") SELECT "firstName", "id", "lastName", "photoUrl", "telegramId", coalesce("username", '') AS "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
