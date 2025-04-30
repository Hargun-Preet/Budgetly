-- AlterTable
ALTER TABLE `category` ADD COLUMN `budgetType` VARCHAR(191) NULL DEFAULT 'monthly',
    ADD COLUMN `lastReset` DATETIME(3) NULL;
