-- CreateTable
CREATE TABLE "OperationType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OperationStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skuId" TEXT NOT NULL,
    "fromStorageId" TEXT,
    "toStorageId" TEXT,
    "operationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OperationStock_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OperationStock_fromStorageId_fkey" FOREIGN KEY ("fromStorageId") REFERENCES "Storage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OperationStock_toStorageId_fkey" FOREIGN KEY ("toStorageId") REFERENCES "Storage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OperationStock_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "typeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Operation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Operation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "OperationType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OperationType_slug_key" ON "OperationType"("slug");
