-- Create database and tables during container initialization
CREATE DATABASE IF NOT EXISTS TaskManagerIdentity;
USE TaskManagerIdentity;

CREATE TABLE IF NOT EXISTS `Role` (
    `id` VARCHAR(36),
    `name` CHAR(15),
    `value` CHAR(15),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(36),
    `roleId` VARCHAR(36),
    `firstName` NVARCHAR(15),
    `lastName` NVARCHAR(30),
    `username` VARCHAR(30),
    `email` VARCHAR(255),
    `hashedPassword` VARCHAR(72),
    `isVerified` TINYINT DEFAULT 1,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (roleId) REFERENCES `Role`(id)
);

-- INSERT SOME DEFAULT VALUE
INSERT INTO `Role` (`id`, `name`, `value`, `createdAt`, `updatedAt`)
VALUES
    (UUID(), "User", "user", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (UUID(), "Admin", "admin", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

