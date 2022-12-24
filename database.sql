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
  `group` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Group ID',
  `username` text NOT NULL COMMENT 'Username',
  `password` longtext NOT NULL COMMENT 'Hashed Password',
  `invite` text DEFAULT NULL COMMENT 'Invite user used',
  `invites` int(11) NOT NULL DEFAULT 0 COMMENT 'Amount of invites user can create',
  `token` text NOT NULL COMMENT 'User token',
  `date` int(11) NOT NULL COMMENT 'Registration date (Unix time)',
  `ip` text NOT NULL COMMENT 'Registration IP',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

REPLACE INTO `accounts` (`id`, `group`, `username`, `password`, `invite`, `invites`, `token`, `date`, `ip`) VALUES
	(1, 2, 'test', 'mDIiELPsWY+rVNKsJXFhyKCRW+oS99MTRO4XzKAGoCE=', NULL, 100, '8TZ06hnpywXAciE60tJifw9W+ImJYX1aZ+4seQvUROQ=', 0, ''),
	(2, 0, 'user', 'i8u6QawPf4GAxWQ4HaMFGHrAUlUrW4SkxjNqF2mwi2c=', NULL, 0, 'ZAt+zGlBRTzYKs/e/lL9S69N1ag3ev2Jfci3oNM9FYY=', 0, ''),
	(3, 0, 'test22', 'mDIiELPsWY+rVNKsJXFhyKCRW+oS99MTRO4XzKAGoCE=', NULL, 0, '7hhEx0iDG5lrpxE0UpBA8w0D2upeVX9iwGMcxPAXlYY=', 2147483647, '::1'),
	(4, 0, 'user1', 'mDIiELPsWY+rVNKsJXFhyKCRW+oS99MTRO4XzKAGoCE=', NULL, 0, 'sLbJvJsMIqeCX93LenJdFs5HOfgvb3AEogEVlvmODhU=', 2147483647, '::ffff:127.0.0.1');

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
