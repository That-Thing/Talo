-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.31-0ubuntu0.22.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for talo
CREATE DATABASE IF NOT EXISTS `talo` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `talo`;

-- Dumping structure for table talo.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `group` tinyint NOT NULL COMMENT 'Group ID',
  `username` text NOT NULL COMMENT 'Username',
  `password` longtext NOT NULL COMMENT 'Hashed Password',
  `invite` text COMMENT 'Invite user used',
  `invites` int NOT NULL DEFAULT '0' COMMENT 'Amount of invites user can create',
  `token` text NOT NULL COMMENT 'User token',
  `date` bigint NOT NULL DEFAULT '0' COMMENT 'Registration date (Unix time)',
  `ip` text NOT NULL COMMENT 'Registration IP',
  `email` text COMMENT 'User Email (optional)',
  `last_login` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'IP used in most recent login',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table talo.api_keys
CREATE TABLE IF NOT EXISTS `api_keys` (
  `key` text NOT NULL COMMENT 'Randomly Generated API key',
  `owner` int NOT NULL DEFAULT '0' COMMENT 'Owner ID',
  `perms` int NOT NULL DEFAULT '0' COMMENT 'Permission level',
  `expire` bigint DEFAULT NULL COMMENT 'Expiration date. Null if infinite.',
  `name` text NOT NULL COMMENT 'Name for API key',
  `Description` mediumtext COMMENT 'Description for API key'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='Keys to access the Talo API';

-- Data exporting was unselected.

-- Dumping structure for table talo.invites
CREATE TABLE IF NOT EXISTS `invites` (
  `invite` text NOT NULL COMMENT 'Invite text',
  `creator` int NOT NULL COMMENT 'Invite creator',
  `uses` int NOT NULL DEFAULT '0' COMMENT 'Invite uses',
  `maxUses` int NOT NULL COMMENT 'Invite maximum uses',
  `date` int NOT NULL COMMENT 'Unix timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table talo.news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID of news post',
  `author` int NOT NULL COMMENT 'Author ID',
  `date` int NOT NULL COMMENT 'Post date',
  `title` text NOT NULL COMMENT 'Post title',
  `content` text NOT NULL COMMENT 'Post content',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
