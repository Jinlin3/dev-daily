/*
  Warnings:

  - You are about to drop the column `projects` on the `Goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goals" DROP COLUMN "projects",
ADD COLUMN     "projectHours" INTEGER NOT NULL DEFAULT 5;
