/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `talo` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `talo`;

CREATE TABLE IF NOT EXISTS `accounts` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID',
    `group` tinyint(2) NOT NULL COMMENT 'Group ID',
    `username` text NOT NULL COMMENT 'Username',
    `password` longtext NOT NULL COMMENT 'Hashed Password',
    `invite` text DEFAULT NULL COMMENT 'Invite user used',
    `invites` int(11) NOT NULL DEFAULT 0 COMMENT 'Amount of invites user can create',
    `token` text NOT NULL COMMENT 'User token',
    `date` bigint(20) NOT NULL DEFAULT 0 COMMENT 'Registration date (Unix time)',
    `ip` text NOT NULL COMMENT 'Registration IP',
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `api_keys` (
                                          `key` text NOT NULL COMMENT 'Randomly Generated API key',
                                          `owner` int(11) NOT NULL DEFAULT 0 COMMENT 'Owner ID',
    `perms` int(11) NOT NULL DEFAULT 0 COMMENT 'Permission level',
    `expire` bigint(20) DEFAULT NULL COMMENT 'Expiration date. Null if infinite.',
    `name` text NOT NULL COMMENT 'Name for API key',
    `Description` mediumtext DEFAULT NULL COMMENT 'Description for API key'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Keys to access the Talo API';

CREATE TABLE IF NOT EXISTS `invites` (
                                         `invite` text NOT NULL COMMENT 'Invite text',
                                         `creator` int(11) NOT NULL COMMENT 'Invite creator',
    `uses` int(11) NOT NULL DEFAULT 0 COMMENT 'Invite uses',
    `maxUses` int(11) NOT NULL COMMENT 'Invite maximum uses',
    `date` int(11) NOT NULL COMMENT 'Unix timestamp'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID of news post',
    `author` int(11) NOT NULL COMMENT 'Author ID',
    `date` int(11) NOT NULL COMMENT 'Post date',
    `title` text NOT NULL COMMENT 'Post title',
    `content` text NOT NULL COMMENT 'Post content',
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
