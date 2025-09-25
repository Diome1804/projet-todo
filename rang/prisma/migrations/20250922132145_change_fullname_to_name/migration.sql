-- Rename fullName column to name
ALTER TABLE `User` CHANGE COLUMN `fullName` `name` VARCHAR(191) NOT NULL;
