/*
  Warnings:

  - You are about to drop the column `projects` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `projectHours` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "projects",
ADD COLUMN     "projectHours" INTEGER NOT NULL;
