/*
  Warnings:

  - You are about to drop the column `email` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "email",
DROP COLUMN "phone";
