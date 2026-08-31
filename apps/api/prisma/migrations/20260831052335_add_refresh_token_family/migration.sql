/*
  Warnings:

  - Added the required column `familyId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- Invalidate all pre-rotation refresh tokens: they have no family lineage,
-- so users must log in again to receive family-tracked tokens.
DELETE FROM "refresh_tokens";

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "familyId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");
