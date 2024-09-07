/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ConfirmationCodeType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationCodeType_slug_key" ON "ConfirmationCodeType"("slug");
