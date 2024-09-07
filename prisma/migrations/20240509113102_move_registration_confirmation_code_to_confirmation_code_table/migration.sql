/*
  Warnings:

  - You are about to drop the `RegistrationConfirmationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RegistrationConfirmationCode";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ConfirmationCodeType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ConfirmationCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "ConfirmationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConfirmationCode_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConfirmationCodeType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
