/*
  Warnings:

  - Added the required column `updatedAt` to the `ConfirmationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ConfirmationCodeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConfirmationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "ConfirmationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConfirmationCode_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConfirmationCodeType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ConfirmationCode" ("code", "createdAt", "expiresAt", "id", "typeId", "userId") SELECT "code", "createdAt", "expiresAt", "id", "typeId", "userId" FROM "ConfirmationCode";
DROP TABLE "ConfirmationCode";
ALTER TABLE "new_ConfirmationCode" RENAME TO "ConfirmationCode";
CREATE TABLE "new_ConfirmationCodeType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ConfirmationCodeType" ("id", "slug") SELECT "id", "slug" FROM "ConfirmationCodeType";
DROP TABLE "ConfirmationCodeType";
ALTER TABLE "new_ConfirmationCodeType" RENAME TO "ConfirmationCodeType";
CREATE UNIQUE INDEX "ConfirmationCodeType_slug_key" ON "ConfirmationCodeType"("slug");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("createdAt", "expiresAt", "id", "userId") SELECT "createdAt", "expiresAt", "id", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "registrationConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "hashedPassword", "id", "registrationConfirmed") SELECT "createdAt", "email", "hashedPassword", "id", "registrationConfirmed" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
