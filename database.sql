-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.11-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.2.0.6576
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for talo
CREATE DATABASE IF NOT EXISTS `talo` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `talo`;

-- Dumping structure for table talo.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `group` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Group ID',
  `username` text NOT NULL COMMENT 'Username',
  `password` longtext NOT NULL COMMENT 'Hashed Password',
  `invite` text DEFAULT NULL COMMENT 'Invite user used',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table talo.invites
CREATE TABLE IF NOT EXISTS `invites` (
  `invite` text NOT NULL COMMENT 'Invite text',
  `creator` int(11) NOT NULL COMMENT 'Invite creator',
  `uses` int(11) NOT NULL DEFAULT 0 COMMENT 'Invite uses',
  `maxUses` int(11) NOT NULL COMMENT 'Invite maximum uses',
  `date` int(11) NOT NULL COMMENT 'Unix timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
