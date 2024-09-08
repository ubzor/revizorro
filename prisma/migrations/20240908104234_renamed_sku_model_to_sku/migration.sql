/*
  Warnings:

  - You are about to drop the `SKU` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "SKU_label_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SKU";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Sku" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skuId" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stock_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Stock_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("createdAt", "id", "quantity", "skuId", "storageId", "updatedAt") SELECT "createdAt", "id", "quantity", "skuId", "storageId", "updatedAt" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Sku_label_key" ON "Sku"("label");
