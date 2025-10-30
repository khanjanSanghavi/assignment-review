/*
  Warnings:

  - You are about to alter the column `overallRating` on the `Store` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "overallRating" SET DEFAULT 0,
ALTER COLUMN "overallRating" SET DATA TYPE INTEGER;
