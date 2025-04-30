/*
  Warnings:

  - You are about to drop the column `budget` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `budget` DOUBLE NULL,
    ADD COLUMN `used` DOUBLE NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `budget`;
