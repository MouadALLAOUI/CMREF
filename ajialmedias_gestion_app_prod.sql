-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 11, 2026 at 11:43 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_42161431_ajialmedias_gestion_app_production_2026`
--
CREATE DATABASE IF NOT EXISTS `if0_42161431_ajialmedias_gestion_app_production_2026` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `if0_42161431_ajialmedias_gestion_app_production_2026`;

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint UNSIGNED DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` char(36) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_login_unique` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `login`, `password`, `created_at`, `updated_at`) VALUES
('019eb79a-b3a8-730d-b050-a5884f161a63', 'admin', '$2y$12$bGhlzO//3s7dJpvuQ1w.AeDZAZaqy3lEPLpupOmn2WjNIwMIDNWZi', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-c12d-7371-94e8-dcbb9d754653', 'mercier.henri', '$2y$12$E.VjshremvEqtGm.Iq.bHOjaoUkPc/XcOXzk19klgUNFtPKWsviAu', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c543-7325-b949-353afdae3544', 'emilie.moulin', '$2y$12$VULlF1JTcdt85uA6imj8geDpcjS6P95cUY1cm5gDef4tnGHN.CmPi', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c869-711d-9f2f-24f06bcd3cde', 'odette.vidal', '$2y$12$M9MK7riq41vMaAXufe8RPevw77CAkHyT3AIcV7oE2YyaiIgMCNuXa', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-cb91-733f-abaa-9b23c59dfd78', 'eric81', '$2y$12$J2y49Zkr0Tdnn7jsNpIz.OYu2ZJh52e/klRHgU/5/cDCa8XtFsdDq', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-cf08-73e2-88e1-34c0d3b365e4', 'hrousset', '$2y$12$EIypmCRHLgLwEBBD73oEOeJkBcB/7k0OHTIlJ6oEGjsz2B9Lo0F.m', '2026-06-11 16:53:56', '2026-06-11 16:53:56');

-- --------------------------------------------------------

--
-- Table structure for table `banques`
--

DROP TABLE IF EXISTS `banques`;
CREATE TABLE IF NOT EXISTS `banques` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `code_abreviation` varchar(10) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `banques`
--

INSERT INTO `banques` (`id`, `nom`, `code_abreviation`, `logo_path`, `is_active`, `created_at`, `updated_at`) VALUES
('019eb79a-b5c0-715b-bbcb-e1bca5a93860', 'Attijariwafa Bank', 'AWB', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b5dd-72ae-bbbc-45f155dc57c8', 'Banque Populaire', 'BCP', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b5f6-70aa-ab23-a7aa14e189a5', 'BMCE Bank of Africa', 'BMCE', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b618-7005-8059-8c365dabcafc', 'Société Générale Maroc', 'SGMB', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b639-7177-8278-a7d4ff117184', 'BMCI', 'BMCI', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b659-708b-b2be-21b37409e8ec', 'Crédit Agricole du Maroc', 'CAM', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b671-711b-9c12-f67051fdb214', 'Crédit du Maroc', 'CDM', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b68b-733b-847d-5dc5e3494ee9', 'CIH Bank', 'CIH', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b6a3-7217-913e-0da245144344', 'Al Barid Bank (Post)', 'ABB', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b6bd-7376-84fc-d099d8a1a0e8', 'Poste-Bank', 'PB', NULL, 1, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-ba6c-71d8-8bfd-3bff7eb3db13', 'Dijoux Fischer et Fils Bank', 'zus', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-ba89-7174-9833-374dcbb48788', 'Petit Regnier SARL Bank', 'lst', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-baa2-7347-927b-eb4f0bafb765', 'Michaud S.A. Bank', 'okn', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-babb-722a-ad06-6714950415aa', 'Delannoy Bank', 'onl', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bad3-7352-a381-13c4f25a97b0', 'Thibault SAS Bank', 'izc', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-baed-7276-82b8-7597cb787c46', 'Girard S.A. Bank', 'mel', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bb05-70b9-af50-f50af9a71647', 'Carpentier Bank', 'hxl', NULL, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51');

-- --------------------------------------------------------

--
-- Table structure for table `b_livraisons`
--

DROP TABLE IF EXISTS `b_livraisons`;
CREATE TABLE IF NOT EXISTS `b_livraisons` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `bl_number` varchar(50) NOT NULL,
  `date_emission` date NOT NULL,
  `mode_envoi` text,
  `type` enum('Livre','Specimen','Pedagogie','Retour') NOT NULL DEFAULT 'Livre',
  `statut_recu` tinyint(1) NOT NULL DEFAULT '0',
  `statut_vu` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('Pending','Seen','Received') DEFAULT 'Pending',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `b_livraisons_bl_number_unique` (`bl_number`),
  KEY `b_livraisons_season_id_foreign` (`season_id`),
  KEY `b_livraisons_rep_id_index` (`rep_id`),
  KEY `b_livraisons_date_emission_index` (`date_emission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `b_livraisons`
--

INSERT INTO `b_livraisons` (`id`, `season_id`, `entity_type`, `rep_id`, `bl_number`, `date_emission`, `mode_envoi`, `type`, `statut_recu`, `statut_vu`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79a-d923-723f-aa26-40f2ae8c61b7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'BL-4036', '2007-10-13', 'postal', 'Retour', 1, 1, 'Pending', 'Neque nam accusantium placeat quo in.', '2026-06-11 16:53:59', '2026-06-11 22:30:51'),
('019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', 'BL-0506', '1983-03-19', 'postal', 'Specimen', 0, 1, 'Pending', 'Esse rerum itaque voluptate explicabo.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d965-7258-b4da-179577338476', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'BL-5158', '1985-04-11', 'postal', 'Specimen', 1, 0, 'Received', 'Aspernatur non iste reiciendis at quam quo velit voluptas.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d997-7334-b516-c35e1a306abb', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', 'BL-4625', '2025-07-24', 'postal', 'Livre', 0, 0, 'Seen', 'Incidunt aut velit sapiente sequi ut assumenda ut.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, 'BL-6547', '2020-03-06', 'courier', 'Specimen', 0, 1, 'Pending', 'Sit doloremque voluptatum vitae ad non enim veniam.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d9c1-7256-94c5-65dd38e6e35b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'BL-7049', '1980-04-02', 'pickup', 'Specimen', 0, 1, 'Pending', 'Voluptate nesciunt praesentium laborum aperiam veritatis et.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d9d8-7154-9c0c-239187ec2e17', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'BL-0577', '1971-04-17', 'pickup', 'Pedagogie', 0, 1, 'Pending', 'Ad commodi deleniti velit vel atque voluptatibus exercitationem.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d9ea-73f7-b078-3821dfbf3d3e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', 'BL-1405', '1995-03-29', 'postal', 'Livre', 1, 1, 'Seen', 'Sint optio aut dolorum aut.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', 'BL-2542', '1999-05-30', 'pickup', 'Specimen', 1, 0, 'Pending', 'Nemo quia sint animi praesentium et illo.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', 'BL-5072', '2002-07-27', 'postal', 'Retour', 1, 1, 'Received', 'Unde modi laudantium iure officiis animi.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb8c2-8d5d-7032-bd7d-188f3a01ed1c', 'BL-132456', '2026-06-11', NULL, 'Livre', 0, 0, 'Pending', NULL, '2026-06-11 22:31:56', '2026-06-11 22:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `b_livraison_imps`
--

DROP TABLE IF EXISTS `b_livraison_imps`;
CREATE TABLE IF NOT EXISTS `b_livraison_imps` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `imprimeur_id` char(36) NOT NULL,
  `date_reception` date NOT NULL,
  `b_livraison_number` varchar(50) NOT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `b_livraison_imps_b_livraison_number_unique` (`b_livraison_number`),
  KEY `b_livraison_imps_season_id_foreign` (`season_id`),
  KEY `b_livraison_imps_imprimeur_id_foreign` (`imprimeur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `b_livraison_imps`
--

INSERT INTO `b_livraison_imps` (`id`, `season_id`, `entity_type`, `imprimeur_id`, `date_reception`, `b_livraison_number`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79a-da7e-7399-b153-5fa11efc791b', NULL, 'MSM-MEDIAS', '019eb79a-b9a9-7341-ac51-2b706d2bc042', '1992-06-07', 'BLI-8825', 'Beatae nisi vel tempora quo.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-db05-71d8-b4d8-eb28832159af', NULL, 'MSM-MEDIAS', '019eb79a-ba00-7344-8abd-0792b682a822', '1994-11-06', 'BLI-2560', 'Commodi ipsa et nam est.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-db46-7320-b0e3-2ea433a1c24c', NULL, 'MSM-MEDIAS', '019eb79a-b560-709c-86d3-05e7048ec41c', '2007-10-02', 'BLI-4110', 'Sit corrupti et illo rerum nemo.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-db9b-705e-ac88-4fdd42f3e77a', NULL, 'MSM-MEDIAS', '019eb79a-b517-7033-832f-47fb744ca39e', '2004-12-02', 'BLI-7126', 'Expedita temporibus minus eum alias nihil non minus.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-dbd4-7290-8b08-f4eda6f549b5', NULL, NULL, '019eb79a-b517-7033-832f-47fb744ca39e', '2000-11-23', 'BLI-8385', 'Ducimus quis quo omnis sit laboriosam placeat.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-dbfe-7114-9b26-69fe85bbb02d', NULL, NULL, '019eb79a-b517-7033-832f-47fb744ca39e', '2020-01-01', 'BLI-2836', 'Sit voluptas officia corrupti molestiae tenetur omnis aut.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-dd0d-72e9-b365-b5b4585e4595', NULL, NULL, '019eb79a-b9a9-7341-ac51-2b706d2bc042', '1989-08-31', 'BLI-5631', 'Eum ut non voluptatum quisquam ut nulla aut quo.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-dd3a-70ff-a843-e51f8d1b953d', NULL, NULL, '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '2016-01-14', 'BLI-0097', 'Dolore natus incidunt est deserunt.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-dd6b-72cb-ad4e-8c652caa807a', NULL, NULL, '019eb79a-b95e-7399-91e1-a39df72fb9be', '1993-11-17', 'BLI-0666', 'Occaecati ut at suscipit magni excepturi odio voluptatem.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-ddad-70a8-9032-130b535fc717', NULL, NULL, '019eb79a-b9a9-7341-ac51-2b706d2bc042', '2023-12-21', 'BLI-0430', 'Eum voluptatum et nisi magni blanditiis.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-de84-72b5-a6aa-a48ccbfef27b', NULL, NULL, '019eb79a-b90b-73f2-913b-b3579c4ce05f', '1978-08-09', 'BLI-8969', 'Possimus aspernatur officiis perferendis omnis incidunt.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-df6a-7210-9bb7-a0300d21d644', NULL, NULL, '019eb79a-ba00-7344-8abd-0792b682a822', '1975-01-18', 'BLI-1261', 'Autem adipisci exercitationem aut.', '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb853-a555-716a-a15f-a3dee91e985d', '019eb79a-b213-72b6-b67f-280713f83ae3', 'MSM-MEDIAS', '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '2026-06-12', 'BL-15', NULL, '2026-06-11 20:15:50', '2026-06-11 20:15:50');

-- --------------------------------------------------------

--
-- Table structure for table `b_livraison_items`
--

DROP TABLE IF EXISTS `b_livraison_items`;
CREATE TABLE IF NOT EXISTS `b_livraison_items` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `deliverable_type` varchar(255) NOT NULL,
  `deliverable_id` char(36) NOT NULL,
  `livre_id` char(36) DEFAULT NULL,
  `quantite` int NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_livraison_items_season_id_foreign` (`season_id`),
  KEY `b_livraison_items_deliverable_type_deliverable_id_index` (`deliverable_type`,`deliverable_id`),
  KEY `b_livraison_items_livre_id_index` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `b_livraison_items`
--

INSERT INTO `b_livraison_items` (`id`, `season_id`, `entity_type`, `deliverable_type`, `deliverable_id`, `livre_id`, `quantite`, `is_deleted`, `created_at`, `updated_at`) VALUES
('019eb79a-e001-7078-a265-478761ab6e70', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d923-723f-aa26-40f2ae8c61b7', '019eb79a-b774-716a-9180-e4cb14612d79', 44, 0, '2026-06-11 16:54:00', '2026-06-11 16:54:00'),
('019eb79a-e070-712a-8c0f-e1a9d1087c5a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d923-723f-aa26-40f2ae8c61b7', '019eb79a-b754-7192-ba3d-38664ad3c555', 60, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e188-73be-91b5-a27734a8ec11', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d923-723f-aa26-40f2ae8c61b7', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 56, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e229-715c-a557-38c719563be7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 85, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e29d-739b-b841-15b09f24cd9a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b7b8-730c-879f-8ee12d3af397', 87, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e2d7-7385-b8e6-d0eb86ff3f06', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 27, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e311-711b-8f46-310d7cd90eba', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 14, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e343-73b6-89ab-194d85069b1f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b7b8-730c-879f-8ee12d3af397', 98, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e36d-7050-b41f-ea20cbb02c65', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 8, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e3c8-71ca-b8cf-cd2db3965851', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b7b8-730c-879f-8ee12d3af397', 50, 0, '2026-06-11 16:54:01', '2026-06-11 16:54:01'),
('019eb79a-e455-721c-898c-393807f75063', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d945-7150-b345-29af92bfeeff', '019eb79a-b811-7252-9728-eebaeb18a6ef', 55, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e4c3-71e3-be5f-a706df17d434', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d965-7258-b4da-179577338476', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 97, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e591-708c-ba29-9df96d46f57e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d965-7258-b4da-179577338476', '019eb79a-b739-72bd-b803-663617062539', 89, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e62e-7190-97e7-690682efb15d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d965-7258-b4da-179577338476', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 89, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e66a-707c-8906-19c52a0c0d8e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d965-7258-b4da-179577338476', '019eb79a-b774-716a-9180-e4cb14612d79', 77, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e6d2-70c2-a796-dede688f3624', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d997-7334-b516-c35e1a306abb', '019eb79a-b811-7252-9728-eebaeb18a6ef', 91, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e70f-72af-ad4f-3d7a907e1d29', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d997-7334-b516-c35e1a306abb', '019eb79a-b70d-705a-a02c-233b09d25488', 86, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e776-738b-881b-1c48d6019bae', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b739-72bd-b803-663617062539', 3, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e7be-7301-a8c3-a847a05fa86c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b811-7252-9728-eebaeb18a6ef', 95, 0, '2026-06-11 16:54:02', '2026-06-11 16:54:02'),
('019eb79a-e830-70d9-ab8b-99f6f2d84443', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 89, 0, '2026-06-11 16:54:03', '2026-06-11 16:54:03'),
('019eb79a-ea55-732d-8b01-bf0384f60772', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 54, 0, '2026-06-11 16:54:03', '2026-06-11 16:54:03'),
('019eb79a-ead2-727d-ae6d-7231406feb39', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b70d-705a-a02c-233b09d25488', 66, 0, '2026-06-11 16:54:03', '2026-06-11 16:54:03'),
('019eb79a-eb57-70c1-acb9-2b0101b64d37', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9af-7087-8e06-5f810ed3f802', '019eb79a-b796-73a2-8425-af22e02c02ec', 87, 0, '2026-06-11 16:54:03', '2026-06-11 16:54:03'),
('019eb79a-ebdb-722d-be85-84a256bf4591', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9c1-7256-94c5-65dd38e6e35b', '019eb79a-b754-7192-ba3d-38664ad3c555', 80, 0, '2026-06-11 16:54:03', '2026-06-11 16:54:03'),
('019eb79a-ebf4-7257-a557-28707cf29b38', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9c1-7256-94c5-65dd38e6e35b', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 17, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ec17-73b4-9ea6-e2754e73e4a1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9c1-7256-94c5-65dd38e6e35b', '019eb79a-b739-72bd-b803-663617062539', 61, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ec62-731b-841a-53a739feedd5', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9c1-7256-94c5-65dd38e6e35b', '019eb79a-b811-7252-9728-eebaeb18a6ef', 60, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ec90-73ff-a49d-4a7249ee1aa0', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9d8-7154-9c0c-239187ec2e17', '019eb79a-b796-73a2-8425-af22e02c02ec', 19, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ece1-7020-bb43-67d1417b0625', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9d8-7154-9c0c-239187ec2e17', '019eb79a-b811-7252-9728-eebaeb18a6ef', 35, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ed26-72ae-ad6d-7a2e27b3046a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9ea-73f7-b078-3821dfbf3d3e', '019eb79a-b796-73a2-8425-af22e02c02ec', 42, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ed53-70ab-a02b-4370f111b831', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9ea-73f7-b078-3821dfbf3d3e', '019eb79a-b774-716a-9180-e4cb14612d79', 91, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ed8c-7022-a20f-bfa7bd7a5706', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9ea-73f7-b078-3821dfbf3d3e', '019eb79a-b70d-705a-a02c-233b09d25488', 34, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-edc8-7142-a902-2b02f4ba6066', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-d9ea-73f7-b078-3821dfbf3d3e', '019eb79a-b774-716a-9180-e4cb14612d79', 37, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ee83-7169-96a9-761f84dd5e65', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b796-73a2-8425-af22e02c02ec', 70, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-eeb0-731b-8257-08d6b6d1b6c2', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 1, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-eee1-71d1-920a-df86d7556e90', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b70d-705a-a02c-233b09d25488', 55, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ef0b-739e-9cc3-2743a309d8f8', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 3, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ef2c-71b4-bf20-ba7729f80720', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b774-716a-9180-e4cb14612d79', 11, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ef45-71e8-9bbb-93f739e8f2b4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da02-738b-b80b-a3cdf72a168e', '019eb79a-b739-72bd-b803-663617062539', 79, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ef87-7187-8509-77ad59afb01d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b7b8-730c-879f-8ee12d3af397', 2, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-ef98-70aa-be0e-faead780e22e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b754-7192-ba3d-38664ad3c555', 82, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-efb0-70dd-8a97-ee1209158e24', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 25, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-efc2-70d5-b597-2320c4868c90', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 71, 0, '2026-06-11 16:54:04', '2026-06-11 16:54:04'),
('019eb79a-efdc-70d7-9995-d7fb3c0c90ba', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b70d-705a-a02c-233b09d25488', 27, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f019-71c1-96fd-642412a2efa3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b811-7252-9728-eebaeb18a6ef', 62, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f0d3-7318-97d7-04dbc4aed327', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb79a-da14-7395-97f0-0fce40a2bae9', '019eb79a-b739-72bd-b803-663617062539', 2, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f1ca-7004-a9d6-960ce79697ba', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b754-7192-ba3d-38664ad3c555', 49, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f20e-7324-9acd-802ad765a608', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b70d-705a-a02c-233b09d25488', 85, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f24a-7167-9d30-0949a6647738', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b739-72bd-b803-663617062539', 54, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f27c-714a-b6da-76bb6cf54901', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b70d-705a-a02c-233b09d25488', 53, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f293-7173-8bdd-982b72041b5d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b739-72bd-b803-663617062539', 46, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f2ad-71f6-8560-e2214476938e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b774-716a-9180-e4cb14612d79', 24, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f2c5-718d-b0f8-32a0d34ea118', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b811-7252-9728-eebaeb18a6ef', 60, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f2df-7002-b184-f88b33bdce58', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-da7e-7399-b153-5fa11efc791b', '019eb79a-b796-73a2-8425-af22e02c02ec', 7, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f301-709d-b49c-ca3fd9293aff', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db05-71d8-b4d8-eb28832159af', '019eb79a-b796-73a2-8425-af22e02c02ec', 11, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f322-7356-acb4-018cf34bb409', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db05-71d8-b4d8-eb28832159af', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 20, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f357-71e0-93e0-c386945ba2d8', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db46-7320-b0e3-2ea433a1c24c', '019eb79a-b774-716a-9180-e4cb14612d79', 106, 0, '2026-06-11 16:54:05', '2026-06-11 19:42:19'),
('019eb79a-f36d-71d5-8bc7-a55e643c4310', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db46-7320-b0e3-2ea433a1c24c', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 6, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f384-7344-91b0-bc4be35342a1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db46-7320-b0e3-2ea433a1c24c', '019eb79a-b739-72bd-b803-663617062539', 25, 0, '2026-06-11 16:54:05', '2026-06-11 16:54:05'),
('019eb79a-f3b7-708b-8a7d-9c3ea51b921c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db46-7320-b0e3-2ea433a1c24c', '019eb79a-b754-7192-ba3d-38664ad3c555', 2, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f3df-721a-a4db-ff4dd250658c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db46-7320-b0e3-2ea433a1c24c', '019eb79a-b754-7192-ba3d-38664ad3c555', 16, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f453-7248-9ab2-5e7efbe84377', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 88, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f4d5-7327-b0ba-5b91cd901a09', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b811-7252-9728-eebaeb18a6ef', 68, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f55d-7044-b4a5-94bf7d7827e8', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 43, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f5ca-7264-ad63-38f8144e60b4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 31, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f5ec-7329-a577-411cc97aaac2', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b774-716a-9180-e4cb14612d79', 18, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f61e-72a8-b039-b15ef3ec6faf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-db9b-705e-ac88-4fdd42f3e77a', '019eb79a-b796-73a2-8425-af22e02c02ec', 97, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f691-70c5-8501-ca4b3e20ee92', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b796-73a2-8425-af22e02c02ec', 56, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f6b3-735e-af86-610440f339bd', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b796-73a2-8425-af22e02c02ec', 95, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f6c4-7208-b897-026fcbec9671', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 54, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f6fd-73ff-b7b8-60ed41756d85', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b70d-705a-a02c-233b09d25488', 11, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f739-70dd-81f4-c543e4444d3b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 35, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f761-72c4-8862-e9bd9b230845', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b796-73a2-8425-af22e02c02ec', 59, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f792-7215-b725-49cc30acfd76', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 38, 0, '2026-06-11 16:54:06', '2026-06-11 16:54:06'),
('019eb79a-f7c4-7238-956f-801b6cb6ec23', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbd4-7290-8b08-f4eda6f549b5', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 14, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-f870-7244-8bd4-e5b3c485c742', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b739-72bd-b803-663617062539', 44, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-f8ea-739d-989e-00d79eb8a567', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 53, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-f923-70ea-a5d6-0352a27fd603', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 41, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-f985-733a-9fde-5c19b26d0103', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b70d-705a-a02c-233b09d25488', 95, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-f9e1-715e-8758-a1465e08866e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b7b8-730c-879f-8ee12d3af397', 10, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-fa1d-71bf-a491-eab70689ecd0', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b7b8-730c-879f-8ee12d3af397', 85, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-fa4c-727d-8c44-f0e2a392dd7b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 88, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-fa7d-71b9-b8a5-ba1e47facae1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 69, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-fab0-731f-abe4-131568c64f93', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dbfe-7114-9b26-69fe85bbb02d', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 30, 0, '2026-06-11 16:54:07', '2026-06-11 16:54:07'),
('019eb79a-faf6-7211-aa64-1dedfaf56f15', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc63-7274-a219-fbb0fa512d84', '019eb79a-b796-73a2-8425-af22e02c02ec', 91, 1, '2026-06-11 16:54:07', '2026-06-11 16:55:19'),
('019eb79a-fb1c-729c-ae5b-1e9a865c0a00', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc63-7274-a219-fbb0fa512d84', '019eb79a-b811-7252-9728-eebaeb18a6ef', 13, 1, '2026-06-11 16:54:07', '2026-06-11 16:55:19'),
('019eb79a-fb4f-734a-82e2-84838d9e6577', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc63-7274-a219-fbb0fa512d84', '019eb79a-b7b8-730c-879f-8ee12d3af397', 46, 1, '2026-06-11 16:54:07', '2026-06-11 16:55:19'),
('019eb79a-fba5-7297-a5b9-45da2e648b33', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b70d-705a-a02c-233b09d25488', 9, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fc0e-70fc-93d1-c14a6f8d1814', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 42, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fc92-7049-8e17-76766fbd2722', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 73, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fcd6-704b-aef4-762d596fde8d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b754-7192-ba3d-38664ad3c555', 49, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fd41-73ee-af6b-97d5da26c416', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 61, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fe08-718d-a0b4-03b8279d4318', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dc9c-71f2-adac-5163cdffcb6a', '019eb79a-b811-7252-9728-eebaeb18a6ef', 53, 1, '2026-06-11 16:54:08', '2026-06-11 17:23:32'),
('019eb79a-fe8e-71c4-b06a-c5cab1fd15b4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd0d-72e9-b365-b5b4585e4595', '019eb79a-b739-72bd-b803-663617062539', 64, 0, '2026-06-11 16:54:08', '2026-06-11 19:31:40'),
('019eb79a-ff4e-71f6-8037-667b2c0cef01', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd0d-72e9-b365-b5b4585e4595', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 21, 0, '2026-06-11 16:54:08', '2026-06-11 16:54:08'),
('019eb79a-ffd8-7061-b246-c45e3aa0fa3e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd3a-70ff-a843-e51f8d1b953d', '019eb79a-b7b8-730c-879f-8ee12d3af397', 62, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-002e-707b-b00c-8be102baf5e7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd3a-70ff-a843-e51f8d1b953d', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 35, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-00a0-73dc-a0f0-46b140282258', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd3a-70ff-a843-e51f8d1b953d', '019eb79a-b7b8-730c-879f-8ee12d3af397', 16, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-00e5-7022-af3a-51d3aa2256e7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd3a-70ff-a843-e51f8d1b953d', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 50, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-016c-73f0-aa55-370ee813f597', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b796-73a2-8425-af22e02c02ec', 20, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-01bb-70f9-8195-11b0af7dabdf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 13, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-01fc-70bd-9c60-995695c7ce34', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b796-73a2-8425-af22e02c02ec', 95, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-023f-7104-abc3-8058881fb46f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b70d-705a-a02c-233b09d25488', 41, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-0291-7330-90e9-550720c1878c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 4, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-02c6-73fe-8b5a-d81a0cf38bcf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b70d-705a-a02c-233b09d25488', 34, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-02fe-73f7-81b0-156ec39bd583', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-dd6b-72cb-ad4e-8c652caa807a', '019eb79a-b811-7252-9728-eebaeb18a6ef', 34, 0, '2026-06-11 16:54:09', '2026-06-11 16:54:09'),
('019eb79b-0368-710f-8f9d-e3747ba5bad4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b811-7252-9728-eebaeb18a6ef', 59, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0397-7039-bad7-14b4ac8932f3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b796-73a2-8425-af22e02c02ec', 57, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-03fb-7268-940c-16cdb6e0deac', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b739-72bd-b803-663617062539', 55, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-045d-7040-b3ba-59718e5d9ee5', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 33, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0535-72c9-a2a8-e57467858b2c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b739-72bd-b803-663617062539', 87, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0579-7070-bcd2-c69c3215e2f5', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 24, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-05fc-71f3-97fc-b05d3b44db4e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-ddad-70a8-9032-130b535fc717', '019eb79a-b754-7192-ba3d-38664ad3c555', 63, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0649-7367-a1f1-b46aea5704b7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-de84-72b5-a6aa-a48ccbfef27b', '019eb79a-b774-716a-9180-e4cb14612d79', 18, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0678-727a-bafc-edf2ac7d5b79', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-de84-72b5-a6aa-a48ccbfef27b', '019eb79a-b754-7192-ba3d-38664ad3c555', 5, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-06b6-739d-ba78-bf0dc5d2321b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-de84-72b5-a6aa-a48ccbfef27b', '019eb79a-b754-7192-ba3d-38664ad3c555', 68, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-06ed-71f6-bbb5-ad412a31bf64', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-df6a-7210-9bb7-a0300d21d644', '019eb79a-b811-7252-9728-eebaeb18a6ef', 96, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-0721-7323-88ea-b015e544338d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-df6a-7210-9bb7-a0300d21d644', '019eb79a-b70d-705a-a02c-233b09d25488', 48, 0, '2026-06-11 16:54:10', '2026-06-11 16:54:10'),
('019eb79b-076e-737f-94c5-ead351ef5fab', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb79a-df6a-7210-9bb7-a0300d21d644', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 79, 0, '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb7af-8dc2-7224-a9f3-088aa894b061', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb7af-8d83-7029-8828-67982177346e', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 15, 1, '2026-06-11 17:16:36', '2026-06-11 17:17:04'),
('019eb7af-8dc8-7308-9c4e-3087ddaabc2d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb7af-8d83-7029-8828-67982177346e', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 14, 1, '2026-06-11 17:16:36', '2026-06-11 17:17:04'),
('019eb853-a5a3-710c-a9dc-600a4f29ac41', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb853-a555-716a-a15f-a3dee91e985d', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 145, 0, '2026-06-11 20:15:50', '2026-06-11 20:15:50'),
('019eb853-a5a8-73d2-9854-0c2527f144b1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb853-a555-716a-a15f-a3dee91e985d', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 14, 0, '2026-06-11 20:15:50', '2026-06-11 20:15:50'),
('019eb853-a5af-70de-a5c8-e0b65db9577a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb853-a555-716a-a15f-a3dee91e985d', '019eb79a-b70d-705a-a02c-233b09d25488', 14, 0, '2026-06-11 20:15:50', '2026-06-11 20:15:50'),
('019eb853-a5b4-7265-8fcb-a6924690eaa3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraisonImp', '019eb853-a555-716a-a15f-a3dee91e985d', '019eb79a-b739-72bd-b803-663617062539', 15, 0, '2026-06-11 20:15:50', '2026-06-11 20:15:50'),
('019eb8d0-412b-72d2-b76b-7f32181ccba9', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 14, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-4133-7252-96a5-f3d9b5d32e9d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 25, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-413a-72e1-a97e-129d17966baf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b70d-705a-a02c-233b09d25488', 14, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-4140-70bb-a419-791b8af661da', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b739-72bd-b803-663617062539', 15, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-4145-715c-af79-235ee75d9b97', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b754-7192-ba3d-38664ad3c555', 47, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-414b-73ec-b6ae-183dcbc28bc0', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b774-716a-9180-e4cb14612d79', 50, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-4151-71fc-b01c-1d18421bdacf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b796-73a2-8425-af22e02c02ec', 24, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56'),
('019eb8d0-4156-70f3-9342-fff2822ed535', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, 'App\\Models\\BLivraison', '019eb8d0-4121-73aa-b40f-ad35648f3271', '019eb79a-b7b8-730c-879f-8ee12d3af397', 247, 0, '2026-06-11 22:31:56', '2026-06-11 22:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `b_ventes_clients`
--

DROP TABLE IF EXISTS `b_ventes_clients`;
CREATE TABLE IF NOT EXISTS `b_ventes_clients` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `client_id` char(36) DEFAULT NULL,
  `b_vente_number` varchar(50) NOT NULL,
  `date_vente` date NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `livre_id` char(36) DEFAULT NULL,
  `quantite` int NOT NULL DEFAULT '0',
  `remise` decimal(5,2) NOT NULL DEFAULT '0.00',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_ventes_clients_season_id_foreign` (`season_id`),
  KEY `b_ventes_clients_livre_id_foreign` (`livre_id`),
  KEY `b_ventes_clients_rep_id_index` (`rep_id`),
  KEY `b_ventes_clients_client_id_index` (`client_id`),
  KEY `b_ventes_clients_date_vente_index` (`date_vente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `b_ventes_clients`
--

INSERT INTO `b_ventes_clients` (`id`, `season_id`, `entity_type`, `rep_id`, `client_id`, `b_vente_number`, `date_vente`, `type`, `livre_id`, `quantite`, `remise`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79b-07d4-72aa-9f89-a6e426e4ba4f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-d650-73a1-b0c2-c654ad9191b2', 'BV-8393', '1996-01-23', 'normal', '019eb79a-b811-7252-9728-eebaeb18a6ef', 8, 10.93, 'Perspiciatis voluptatem omnis laborum.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0828-70b2-a87d-dcf6e8615560', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-d5bb-73be-94b9-3ca1d557db9c', 'BV-2047', '2015-02-14', 'normal', '019eb79a-b70d-705a-a02c-233b09d25488', 11, 14.01, 'Nemo veniam accusamus esse.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-08a6-71fc-a81f-597d2c6ccaf9', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-d5a1-7287-a6b7-d52e5ac05bee', 'BV-0182', '2005-04-08', 'retour', '019eb79a-b811-7252-9728-eebaeb18a6ef', 32, 24.30, 'Ratione rem nesciunt facilis eligendi suscipit fugiat.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-08f1-715c-8446-6a6185bc4431', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-d650-73a1-b0c2-c654ad9191b2', 'BV-9873', '1972-04-23', 'normal', '019eb79a-b7b8-730c-879f-8ee12d3af397', 31, 20.04, 'Quaerat vitae magnam reiciendis est consequatur ratione.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-091b-72e7-8d2c-3d6d9cb575b2', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-d604-7076-ade8-77168c9a9c78', 'BV-7430', '2005-07-11', 'normal', '019eb79a-b774-716a-9180-e4cb14612d79', 22, 20.03, 'Quo cumque sunt mollitia est sunt.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0962-7095-8f16-dda624c2ab01', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-d5d3-7251-83b2-b6fbb99fa46f', 'BV-1338', '1993-04-27', 'retour', '019eb79a-b796-73a2-8425-af22e02c02ec', 12, 3.14, 'Ut aut id incidunt incidunt ex.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0998-739e-b76e-12abd328a7a4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-d604-7076-ade8-77168c9a9c78', 'BV-2583', '2014-05-22', 'normal', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', 33, 8.45, 'Laboriosam pariatur quod eligendi ea sunt qui.', '2026-06-11 16:54:11', '2026-06-11 16:54:11');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-banques_all', 'O:39:\"Illuminate\\Database\\Eloquent\\Collection\":2:{s:8:\"\0*\0items\";a:17:{i:0;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b6a3-7217-913e-0da245144344\";s:3:\"nom\";s:20:\"Al Barid Bank (Post)\";s:16:\"code_abreviation\";s:3:\"ABB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b6a3-7217-913e-0da245144344\";s:3:\"nom\";s:20:\"Al Barid Bank (Post)\";s:16:\"code_abreviation\";s:3:\"ABB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:1;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5c0-715b-bbcb-e1bca5a93860\";s:3:\"nom\";s:17:\"Attijariwafa Bank\";s:16:\"code_abreviation\";s:3:\"AWB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5c0-715b-bbcb-e1bca5a93860\";s:3:\"nom\";s:17:\"Attijariwafa Bank\";s:16:\"code_abreviation\";s:3:\"AWB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:2;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5dd-72ae-bbbc-45f155dc57c8\";s:3:\"nom\";s:16:\"Banque Populaire\";s:16:\"code_abreviation\";s:3:\"BCP\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5dd-72ae-bbbc-45f155dc57c8\";s:3:\"nom\";s:16:\"Banque Populaire\";s:16:\"code_abreviation\";s:3:\"BCP\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:3;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5f6-70aa-ab23-a7aa14e189a5\";s:3:\"nom\";s:19:\"BMCE Bank of Africa\";s:16:\"code_abreviation\";s:4:\"BMCE\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b5f6-70aa-ab23-a7aa14e189a5\";s:3:\"nom\";s:19:\"BMCE Bank of Africa\";s:16:\"code_abreviation\";s:4:\"BMCE\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:4;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b639-7177-8278-a7d4ff117184\";s:3:\"nom\";s:4:\"BMCI\";s:16:\"code_abreviation\";s:4:\"BMCI\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b639-7177-8278-a7d4ff117184\";s:3:\"nom\";s:4:\"BMCI\";s:16:\"code_abreviation\";s:4:\"BMCI\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:5;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-bb05-70b9-af50-f50af9a71647\";s:3:\"nom\";s:15:\"Carpentier Bank\";s:16:\"code_abreviation\";s:3:\"hxl\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-bb05-70b9-af50-f50af9a71647\";s:3:\"nom\";s:15:\"Carpentier Bank\";s:16:\"code_abreviation\";s:3:\"hxl\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:6;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b68b-733b-847d-5dc5e3494ee9\";s:3:\"nom\";s:8:\"CIH Bank\";s:16:\"code_abreviation\";s:3:\"CIH\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b68b-733b-847d-5dc5e3494ee9\";s:3:\"nom\";s:8:\"CIH Bank\";s:16:\"code_abreviation\";s:3:\"CIH\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:7;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b659-708b-b2be-21b37409e8ec\";s:3:\"nom\";s:25:\"Crédit Agricole du Maroc\";s:16:\"code_abreviation\";s:3:\"CAM\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b659-708b-b2be-21b37409e8ec\";s:3:\"nom\";s:25:\"Crédit Agricole du Maroc\";s:16:\"code_abreviation\";s:3:\"CAM\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:8;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b671-711b-9c12-f67051fdb214\";s:3:\"nom\";s:16:\"Crédit du Maroc\";s:16:\"code_abreviation\";s:3:\"CDM\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b671-711b-9c12-f67051fdb214\";s:3:\"nom\";s:16:\"Crédit du Maroc\";s:16:\"code_abreviation\";s:3:\"CDM\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:9;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-babb-722a-ad06-6714950415aa\";s:3:\"nom\";s:13:\"Delannoy Bank\";s:16:\"code_abreviation\";s:3:\"onl\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-babb-722a-ad06-6714950415aa\";s:3:\"nom\";s:13:\"Delannoy Bank\";s:16:\"code_abreviation\";s:3:\"onl\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:10;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-ba6c-71d8-8bfd-3bff7eb3db13\";s:3:\"nom\";s:27:\"Dijoux Fischer et Fils Bank\";s:16:\"code_abreviation\";s:3:\"zus\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-ba6c-71d8-8bfd-3bff7eb3db13\";s:3:\"nom\";s:27:\"Dijoux Fischer et Fils Bank\";s:16:\"code_abreviation\";s:3:\"zus\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:11;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-baed-7276-82b8-7597cb787c46\";s:3:\"nom\";s:16:\"Girard S.A. Bank\";s:16:\"code_abreviation\";s:3:\"mel\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-baed-7276-82b8-7597cb787c46\";s:3:\"nom\";s:16:\"Girard S.A. Bank\";s:16:\"code_abreviation\";s:3:\"mel\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:12;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-baa2-7347-927b-eb4f0bafb765\";s:3:\"nom\";s:17:\"Michaud S.A. Bank\";s:16:\"code_abreviation\";s:3:\"okn\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-baa2-7347-927b-eb4f0bafb765\";s:3:\"nom\";s:17:\"Michaud S.A. Bank\";s:16:\"code_abreviation\";s:3:\"okn\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:13;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-ba89-7174-9833-374dcbb48788\";s:3:\"nom\";s:23:\"Petit Regnier SARL Bank\";s:16:\"code_abreviation\";s:3:\"lst\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-ba89-7174-9833-374dcbb48788\";s:3:\"nom\";s:23:\"Petit Regnier SARL Bank\";s:16:\"code_abreviation\";s:3:\"lst\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:14;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b6bd-7376-84fc-d099d8a1a0e8\";s:3:\"nom\";s:10:\"Poste-Bank\";s:16:\"code_abreviation\";s:2:\"PB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b6bd-7376-84fc-d099d8a1a0e8\";s:3:\"nom\";s:10:\"Poste-Bank\";s:16:\"code_abreviation\";s:2:\"PB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:15;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-b618-7005-8059-8c365dabcafc\";s:3:\"nom\";s:26:\"Société Générale Maroc\";s:16:\"code_abreviation\";s:4:\"SGMB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-b618-7005-8059-8c365dabcafc\";s:3:\"nom\";s:26:\"Société Générale Maroc\";s:16:\"code_abreviation\";s:4:\"SGMB\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:50\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:50\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:16;O:17:\"App\\Models\\Banque\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"banques\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:7:{s:2:\"id\";s:36:\"019eb79a-bad3-7352-a381-13c4f25a97b0\";s:3:\"nom\";s:17:\"Thibault SAS Bank\";s:16:\"code_abreviation\";s:3:\"izc\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:11:\"\0*\0original\";a:7:{s:2:\"id\";s:36:\"019eb79a-bad3-7352-a381-13c4f25a97b0\";s:3:\"nom\";s:17:\"Thibault SAS Bank\";s:16:\"code_abreviation\";s:3:\"izc\";s:9:\"logo_path\";N;s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:51\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:51\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:1:{s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:4:{i:0;s:3:\"nom\";i:1;s:16:\"code_abreviation\";i:2;s:9:\"logo_path\";i:3;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1781221076),
('laravel-cache-categories_all', 'O:39:\"Illuminate\\Database\\Eloquent\\Collection\":2:{s:8:\"\0*\0items\";a:5:{i:0;O:19:\"App\\Models\\Category\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:10:\"categories\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:5:{s:2:\"id\";s:36:\"019eb79a-b460-736b-9263-439595727d1e\";s:7:\"libelle\";s:8:\"Collège\";s:11:\"description\";s:34:\"Enseignement secondaire collégial\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:5:{s:2:\"id\";s:36:\"019eb79a-b460-736b-9263-439595727d1e\";s:7:\"libelle\";s:8:\"Collège\";s:11:\"description\";s:34:\"Enseignement secondaire collégial\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:0:{}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:2:{i:0;s:7:\"libelle\";i:1;s:11:\"description\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:1;O:19:\"App\\Models\\Category\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:10:\"categories\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:5:{s:2:\"id\";s:36:\"019eb79a-b480-7024-ae70-57cbfbebc212\";s:7:\"libelle\";s:6:\"Lycée\";s:11:\"description\";s:34:\"Enseignement secondaire qualifiant\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:5:{s:2:\"id\";s:36:\"019eb79a-b480-7024-ae70-57cbfbebc212\";s:7:\"libelle\";s:6:\"Lycée\";s:11:\"description\";s:34:\"Enseignement secondaire qualifiant\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:0:{}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:2:{i:0;s:7:\"libelle\";i:1;s:11:\"description\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:2;O:19:\"App\\Models\\Category\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:10:\"categories\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:5:{s:2:\"id\";s:36:\"019eb79a-b4a2-72bd-a0a1-77f58a40e105\";s:7:\"libelle\";s:14:\"Près-scolaire\";s:11:\"description\";s:25:\"Enseignement préscolaire\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:5:{s:2:\"id\";s:36:\"019eb79a-b4a2-72bd-a0a1-77f58a40e105\";s:7:\"libelle\";s:14:\"Près-scolaire\";s:11:\"description\";s:25:\"Enseignement préscolaire\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:0:{}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:2:{i:0;s:7:\"libelle\";i:1;s:11:\"description\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:3;O:19:\"App\\Models\\Category\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:10:\"categories\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:5:{s:2:\"id\";s:36:\"019eb79a-b436-724d-9394-ccdc0f8d0257\";s:7:\"libelle\";s:8:\"Primaire\";s:11:\"description\";s:21:\"Enseignement primaire\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:5:{s:2:\"id\";s:36:\"019eb79a-b436-724d-9394-ccdc0f8d0257\";s:7:\"libelle\";s:8:\"Primaire\";s:11:\"description\";s:21:\"Enseignement primaire\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:0:{}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:2:{i:0;s:7:\"libelle\";i:1;s:11:\"description\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:4;O:19:\"App\\Models\\Category\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:10:\"categories\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:5:{s:2:\"id\";s:36:\"019eb79a-b4c4-71b8-89fb-227bd3695d4d\";s:7:\"libelle\";s:7:\"Robotos\";s:11:\"description\";s:38:\"Matériel de robotique et informatique\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:5:{s:2:\"id\";s:36:\"019eb79a-b4c4-71b8-89fb-227bd3695d4d\";s:7:\"libelle\";s:7:\"Robotos\";s:11:\"description\";s:38:\"Matériel de robotique et informatique\";s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:0:{}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:2:{i:0;s:7:\"libelle\";i:1;s:11:\"description\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1781220637);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-seasons_all', 'O:39:\"Illuminate\\Database\\Eloquent\\Collection\":2:{s:8:\"\0*\0items\";a:7:{i:0;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b0fd-71c5-8946-c209b28ed84c\";s:4:\"name\";s:4:\"2324\";s:10:\"start_date\";s:10:\"2023-09-01\";s:10:\"start_year\";s:4:\"2023\";s:8:\"end_date\";s:10:\"2024-08-31\";s:8:\"end_year\";s:4:\"2024\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:48\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:48\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b0fd-71c5-8946-c209b28ed84c\";s:4:\"name\";s:4:\"2324\";s:10:\"start_date\";s:10:\"2023-09-01\";s:10:\"start_year\";s:4:\"2023\";s:8:\"end_date\";s:10:\"2024-08-31\";s:8:\"end_year\";s:4:\"2024\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:48\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:48\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:1;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b172-7140-b5b4-6b702b54e43a\";s:4:\"name\";s:4:\"2425\";s:10:\"start_date\";s:10:\"2024-09-01\";s:10:\"start_year\";s:4:\"2024\";s:8:\"end_date\";s:10:\"2025-08-31\";s:8:\"end_year\";s:4:\"2025\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b172-7140-b5b4-6b702b54e43a\";s:4:\"name\";s:4:\"2425\";s:10:\"start_date\";s:10:\"2024-09-01\";s:10:\"start_year\";s:4:\"2024\";s:8:\"end_date\";s:10:\"2025-08-31\";s:8:\"end_year\";s:4:\"2025\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:2;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b1b0-735f-96f7-94287d66df2e\";s:4:\"name\";s:4:\"2526\";s:10:\"start_date\";s:10:\"2025-09-01\";s:10:\"start_year\";s:4:\"2025\";s:8:\"end_date\";s:10:\"2026-08-31\";s:8:\"end_year\";s:4:\"2026\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b1b0-735f-96f7-94287d66df2e\";s:4:\"name\";s:4:\"2526\";s:10:\"start_date\";s:10:\"2025-09-01\";s:10:\"start_year\";s:4:\"2025\";s:8:\"end_date\";s:10:\"2026-08-31\";s:8:\"end_year\";s:4:\"2026\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:3;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b213-72b6-b67f-280713f83ae3\";s:4:\"name\";s:4:\"2627\";s:10:\"start_date\";s:10:\"2026-09-01\";s:10:\"start_year\";s:4:\"2026\";s:8:\"end_date\";s:10:\"2027-08-31\";s:8:\"end_year\";s:4:\"2027\";s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b213-72b6-b67f-280713f83ae3\";s:4:\"name\";s:4:\"2627\";s:10:\"start_date\";s:10:\"2026-09-01\";s:10:\"start_year\";s:4:\"2026\";s:8:\"end_date\";s:10:\"2027-08-31\";s:8:\"end_year\";s:4:\"2027\";s:9:\"is_active\";i:1;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:4;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b233-72b3-ad04-0d6ac33fb443\";s:4:\"name\";s:4:\"2728\";s:10:\"start_date\";s:10:\"2027-09-01\";s:10:\"start_year\";s:4:\"2027\";s:8:\"end_date\";s:10:\"2028-08-31\";s:8:\"end_year\";s:4:\"2028\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b233-72b3-ad04-0d6ac33fb443\";s:4:\"name\";s:4:\"2728\";s:10:\"start_date\";s:10:\"2027-09-01\";s:10:\"start_year\";s:4:\"2027\";s:8:\"end_date\";s:10:\"2028-08-31\";s:8:\"end_year\";s:4:\"2028\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:5;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b253-7118-a974-b8b1d3464321\";s:4:\"name\";s:4:\"2829\";s:10:\"start_date\";s:10:\"2028-09-01\";s:10:\"start_year\";s:4:\"2028\";s:8:\"end_date\";s:10:\"2029-08-31\";s:8:\"end_year\";s:4:\"2029\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b253-7118-a974-b8b1d3464321\";s:4:\"name\";s:4:\"2829\";s:10:\"start_date\";s:10:\"2028-09-01\";s:10:\"start_year\";s:4:\"2028\";s:8:\"end_date\";s:10:\"2029-08-31\";s:8:\"end_year\";s:4:\"2029\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}i:6;O:17:\"App\\Models\\Season\":33:{s:13:\"\0*\0connection\";s:5:\"mysql\";s:8:\"\0*\0table\";s:7:\"seasons\";s:13:\"\0*\0primaryKey\";s:2:\"id\";s:10:\"\0*\0keyType\";s:6:\"string\";s:12:\"incrementing\";b:0;s:7:\"\0*\0with\";a:0:{}s:12:\"\0*\0withCount\";a:0:{}s:19:\"preventsLazyLoading\";b:0;s:10:\"\0*\0perPage\";i:15;s:6:\"exists\";b:1;s:18:\"wasRecentlyCreated\";b:0;s:28:\"\0*\0escapeWhenCastingToString\";b:0;s:13:\"\0*\0attributes\";a:9:{s:2:\"id\";s:36:\"019eb79a-b26d-71dc-bfeb-2394fa209456\";s:4:\"name\";s:4:\"2930\";s:10:\"start_date\";s:10:\"2029-09-01\";s:10:\"start_year\";s:4:\"2029\";s:8:\"end_date\";s:10:\"2030-08-31\";s:8:\"end_year\";s:4:\"2030\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:11:\"\0*\0original\";a:9:{s:2:\"id\";s:36:\"019eb79a-b26d-71dc-bfeb-2394fa209456\";s:4:\"name\";s:4:\"2930\";s:10:\"start_date\";s:10:\"2029-09-01\";s:10:\"start_year\";s:4:\"2029\";s:8:\"end_date\";s:10:\"2030-08-31\";s:8:\"end_year\";s:4:\"2030\";s:9:\"is_active\";i:0;s:10:\"created_at\";s:19:\"2026-06-11 17:53:49\";s:10:\"updated_at\";s:19:\"2026-06-11 17:53:49\";}s:10:\"\0*\0changes\";a:0:{}s:11:\"\0*\0previous\";a:0:{}s:8:\"\0*\0casts\";a:3:{s:10:\"start_date\";s:4:\"date\";s:8:\"end_date\";s:4:\"date\";s:9:\"is_active\";s:7:\"boolean\";}s:17:\"\0*\0classCastCache\";a:0:{}s:21:\"\0*\0attributeCastCache\";a:0:{}s:13:\"\0*\0dateFormat\";N;s:10:\"\0*\0appends\";a:0:{}s:19:\"\0*\0dispatchesEvents\";a:0:{}s:14:\"\0*\0observables\";a:0:{}s:12:\"\0*\0relations\";a:0:{}s:10:\"\0*\0touches\";a:0:{}s:27:\"\0*\0relationAutoloadCallback\";N;s:26:\"\0*\0relationAutoloadContext\";N;s:10:\"timestamps\";b:1;s:13:\"usesUniqueIds\";b:1;s:9:\"\0*\0hidden\";a:2:{i:0;s:10:\"created_at\";i:1;s:10:\"updated_at\";}s:10:\"\0*\0visible\";a:0:{}s:11:\"\0*\0fillable\";a:6:{i:0;s:4:\"name\";i:1;s:10:\"start_date\";i:2;s:10:\"start_year\";i:3;s:8:\"end_date\";i:4;s:8:\"end_year\";i:5;s:9:\"is_active\";}s:10:\"\0*\0guarded\";a:1:{i:0;s:1:\"*\";}}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1781216860);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cahier_communication`
--

DROP TABLE IF EXISTS `cahier_communication`;
CREATE TABLE IF NOT EXISTS `cahier_communication` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `ecole` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `qte` int NOT NULL DEFAULT '0',
  `nom_fichier` varchar(255) DEFAULT NULL,
  `date_commande` date NOT NULL,
  `bon_de_commande` varchar(255) DEFAULT NULL,
  `indication` text,
  `model_recto` varchar(255) DEFAULT NULL,
  `model_verso` varchar(255) DEFAULT NULL,
  `is_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `is_refused` tinyint(1) NOT NULL DEFAULT '0',
  `etat_model` int NOT NULL DEFAULT '0',
  `date_validate_model` datetime DEFAULT NULL,
  `is_bc_validated` tinyint(1) NOT NULL DEFAULT '0',
  `is_printed` tinyint(1) NOT NULL DEFAULT '0',
  `is_delivered` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `remarques` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cahier_communication_season_id_foreign` (`season_id`),
  KEY `cahier_communication_rep_id_index` (`rep_id`),
  KEY `cahier_communication_is_deleted_index` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cahier_communication`
--

INSERT INTO `cahier_communication` (`id`, `season_id`, `entity_type`, `rep_id`, `ecole`, `type`, `qte`, `nom_fichier`, `date_commande`, `bon_de_commande`, `indication`, `model_recto`, `model_verso`, `is_accepted`, `is_refused`, `etat_model`, `date_validate_model`, `is_bc_validated`, `is_printed`, `is_delivered`, `is_deleted`, `remarques`, `created_at`, `updated_at`) VALUES
('019eb79b-13b2-715d-b01b-90c34df39f96', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', 'Duval S.A.R.L.', 'dolor', 111, 'rerum.pdf', '2015-01-01', 'aut', 'Impedit dicta optio impedit vero omnis temporibus magnam suscipit.', 'itaque', 'rerum', 1, 0, 3, '2006-03-08 00:01:50', 1, 1, 1, 0, 'Deleniti ab officiis neque quia.', '2026-06-11 16:54:14', '2026-06-11 22:44:23'),
('019eb79b-13de-725f-8d82-afdc8b5c581e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, 'Hamel Becker et Fils', 'a', 367, 'est.pdf', '2017-09-05', 'ut', 'Aut exercitationem non quam repellat.', 'non', 'totam', 0, 0, 0, '1971-05-18 00:24:05', 0, 0, 1, 0, 'Facilis molestiae iure ipsam voluptatibus culpa.', '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-13fa-70d1-8a2e-cf156c2fadb3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', 'Faivre', 'illum', 107, 'nihil.pdf', '2025-11-17', 'voluptas', 'Maiores quibusdam qui minus temporibus molestias.', 'deserunt', 'laudantium', 1, 1, 2, '1984-02-09 16:37:57', 0, 1, 0, 0, 'Ut aut suscipit tenetur numquam consequatur eveniet.', '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-1410-70dc-9b81-97cd11a550af', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'Benard', 'veritatis', 115, 'aut.pdf', '2019-12-09', 'accusamus', 'Aut expedita id et quos.', 'est', 'omnis', 0, 1, 2, '2000-05-31 08:32:57', 1, 1, 0, 0, 'Ut praesentium expedita facere pariatur saepe dolorem.', '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-142c-717b-a74f-6ac3d4b75cab', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'Charrier Aubry S.A.S.', 'est', 411, 'itaque.pdf', '2024-07-26', 'corrupti', 'Ut libero voluptatem in soluta.', 'consequatur', 'laudantium', 1, 0, 2, '2023-08-02 21:15:38', 1, 0, 1, 0, 'Molestiae modi repellat reiciendis et quod quis.', '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-1442-72a2-af13-54a57e652d76', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, 'Peron Coste S.A.R.L.', 'officiis', 457, 'esse.pdf', '1999-11-23', 'accusantium', 'Placeat recusandae nesciunt ratione aliquid qui quo autem.', 'sint', 'ex', 1, 0, 2, '2018-05-04 06:33:52', 1, 1, 1, 0, 'Minima tempore recusandae qui earum animi.', '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-1466-7325-a0cf-1cb5d6a64744', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', 'Guillet', 'qui', 443, 'harum.pdf', '1981-04-19', 'quo', 'Doloribus animi amet praesentium rerum et quos quia veritatis.', 'sapiente', 'nihil', 1, 0, 2, '1983-09-17 17:29:27', 1, 0, 1, 0, 'Saepe accusantium ut ut voluptatem.', '2026-06-11 16:54:14', '2026-06-11 16:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `cahier_templates`
--

DROP TABLE IF EXISTS `cahier_templates`;
CREATE TABLE IF NOT EXISTS `cahier_templates` (
  `id` char(36) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text,
  `contenu` text NOT NULL,
  `variables` varchar(255) DEFAULT NULL,
  `est_actif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carte_visites`
--

DROP TABLE IF EXISTS `carte_visites`;
CREATE TABLE IF NOT EXISTS `carte_visites` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `date_commande` date NOT NULL,
  `nom_sur_carte` varchar(255) NOT NULL,
  `fonction` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` text,
  `autre_info` text,
  `logo_path` varchar(255) DEFAULT NULL,
  `chevalet_ligne_1` varchar(255) DEFAULT NULL,
  `chevalet_ligne_2` varchar(255) DEFAULT NULL,
  `chevalet_ligne_3` varchar(255) DEFAULT NULL,
  `conception_carte` varchar(255) DEFAULT NULL,
  `is_valide_carte` tinyint(1) NOT NULL DEFAULT '0',
  `conception_chevalet` varchar(255) DEFAULT NULL,
  `is_valide_chevalet` tinyint(1) NOT NULL DEFAULT '0',
  `comment_cv` text,
  `comment_chevalet` text,
  `remarques` text,
  `prod_carte` tinyint(1) NOT NULL DEFAULT '0',
  `livraison_carte` tinyint(1) NOT NULL DEFAULT '0',
  `recu_carte` tinyint(1) NOT NULL DEFAULT '0',
  `prod_chevalet` tinyint(1) NOT NULL DEFAULT '0',
  `livraison_chevalet` tinyint(1) NOT NULL DEFAULT '0',
  `recu_chevalet` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carte_visites_season_id_foreign` (`season_id`),
  KEY `carte_visites_rep_id_index` (`rep_id`),
  KEY `carte_visites_is_deleted_index` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carte_visites`
--

INSERT INTO `carte_visites` (`id`, `season_id`, `entity_type`, `rep_id`, `model`, `date_commande`, `nom_sur_carte`, `fonction`, `tel`, `email`, `adresse`, `autre_info`, `logo_path`, `chevalet_ligne_1`, `chevalet_ligne_2`, `chevalet_ligne_3`, `conception_carte`, `is_valide_carte`, `conception_chevalet`, `is_valide_chevalet`, `comment_cv`, `comment_chevalet`, `remarques`, `prod_carte`, `livraison_carte`, `recu_carte`, `prod_chevalet`, `livraison_chevalet`, `recu_chevalet`, `is_deleted`, `created_at`, `updated_at`) VALUES
('019eb79b-129e-7225-998e-cdac4ac3a76b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', 'nisi', '2025-06-18', 'Joséphine Hebert', 'Modéliste industriel', '+33 8 18 48 43 50', 'hperrot@example.com', '93, rue Augustin Carlier\n11196 Bourdon', 'Sint quia nam velit magnam tenetur vel.', NULL, 'quas', 'est', 'in', '1', 0, '1', 0, 'Quo rerum deserunt culpa ut vel officiis deleniti.', 'Odit quaerat molestias non.', 'Ut ea dolore repudiandae ut soluta et ad.', 1, 0, 1, 1, 0, 1, 0, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-12bb-735b-9406-fc4484f518fe', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'dolor', '1988-10-27', 'Théophile Regnier', 'Technicien bovin', '+33 1 16 31 24 51', 'letellier.franck@example.net', '78, avenue Philippe Legrand\n02071 Robert-les-Bains', 'Non sint blanditiis sequi et voluptatem vero recusandae voluptatem.', NULL, 'quia', 'ipsum', 'eveniet', '1', 0, '1', 0, 'Ut rerum minima et alias velit error totam.', 'Eos ut minus autem ut eius delectus nesciunt.', 'Est rerum sit doloribus et aut eum architecto.', 1, 0, 1, 0, 0, 1, 0, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-12e7-7222-a3ca-927e85ce322b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, 'voluptas', '1977-08-21', 'Lucie Francois', 'Chasseur-bagagiste', '+33 (0)4 90 60 96 28', 'aurore.allard@example.org', '55, place de Maillot\n68364 Cousin', 'Sit odit cupiditate veniam.', NULL, 'repellendus', 'nostrum', 'commodi', '1', 1, '0', 1, 'Mollitia quae eveniet eos totam.', 'Facere autem ut non.', 'Dolores quo nobis quia quis rerum doloribus fugit qui.', 1, 1, 1, 1, 1, 1, 0, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1301-72f6-b748-8b576d6d658f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'facilis', '1977-08-04', 'Hélène Blanc', 'Matelassier', '02 93 39 44 64', 'moreno.camille@example.com', '1, rue Gaillard\n46745 RollandBourg', 'Tempore rerum maxime magni est.', NULL, 'sequi', 'iure', 'provident', '1', 1, '1', 0, 'Adipisci ex vitae error aut laboriosam ipsa.', 'Cumque harum in ratione recusandae aut quis.', 'Sed ab voluptas sunt voluptatibus.', 0, 1, 0, 0, 0, 1, 0, '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-132b-71bb-aa17-b14dd39ea2c4', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', 'molestiae', '1984-01-14', 'Louise Lecoq', 'Pilote de soutireuse', '+33 9 66 98 48 39', 'christine.neveu@example.org', '854, chemin de Leconte\n07286 Payetboeuf', 'Quia et harum ut consequuntur in eaque voluptas.', NULL, 'a', 'nemo', 'ab', '0', 1, '1', 0, 'Ut provident earum blanditiis possimus omnis repellat quisquam.', 'Sint ea odio ipsam deserunt omnis in.', 'Officiis illo sed sit est molestias deleniti sit.', 1, 0, 1, 1, 1, 1, 0, '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-1344-733b-853c-76dfbd0e2220', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'nisi', '1972-02-28', 'Matthieu-Vincent De Sousa', 'Conception et études', '0322045573', 'ddubois@example.com', 'impasse Constance Bernier\n99848 Guillot-sur-Mer', 'Qui quod et ea et voluptate id.', NULL, 'earum', 'tenetur', 'nesciunt', '1', 0, '1', 0, 'Vel est dolorem sint recusandae iste incidunt quas.', 'Mollitia nobis harum eveniet qui.', 'Aut iusto et in sint aperiam.', 0, 1, 1, 1, 1, 1, 0, '2026-06-11 16:54:14', '2026-06-11 16:54:14'),
('019eb79b-1362-734b-bd81-32a6631eba39', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'blanditiis', '2013-12-22', 'Marcel Leleu', 'Ingénieur logistique', '+33 (0)8 25 89 87 47', 'bodin.therese@example.org', '68, boulevard Lucy Prevost\n03410 Leduc-sur-Mer', 'Mollitia error molestiae vero qui voluptas excepturi.', NULL, 'id', 'quo', 'sit', '1', 1, '1', 1, 'Necessitatibus et esse quo et.', 'Omnis quia praesentium odit rerum ut quia.', 'Pariatur in eos sapiente velit odit.', 1, 1, 1, 0, 0, 1, 0, '2026-06-11 16:54:14', '2026-06-11 16:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `catalogues`
--

DROP TABLE IF EXISTS `catalogues`;
CREATE TABLE IF NOT EXISTS `catalogues` (
  `id` char(36) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `categorie_id` char(36) DEFAULT NULL,
  `image_url` text,
  `content` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catalogues_categorie_id_foreign` (`categorie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `catalogues`
--

INSERT INTO `catalogues` (`id`, `titre`, `categorie_id`, `image_url`, `content`, `created_at`, `updated_at`) VALUES
('019eb79a-d697-71aa-acba-1cad4775387e', 'Sit non distinctio inventore vero.', '019eb79a-b460-736b-9263-439595727d1e', 'https://via.placeholder.com/640x480.png/004466?text=laborum', 'Dolor et cumque nisi ut adipisci voluptatem. Odio inventore qui placeat. Sit atque assumenda iure corrupti est.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d6b4-73b5-b588-81e0329ade39', 'Sit voluptas.', '019eb79a-b4a2-72bd-a0a1-77f58a40e105', 'https://via.placeholder.com/640x480.png/0066ee?text=voluptatum', 'Vitae vel quia tenetur dolorem enim asperiores. Voluptate qui et facilis eos ut nobis. Quo quia et qui id consectetur doloribus. Delectus occaecati sapiente velit a nemo.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d6cc-7126-80ee-cd53f84e2a45', 'Voluptatem laudantium facere nisi quibusdam.', '019eb79a-b436-724d-9394-ccdc0f8d0257', 'https://via.placeholder.com/640x480.png/003377?text=recusandae', 'Consequatur eius ut et sit dignissimos amet error qui. Vel occaecati expedita rem tenetur. Vel accusamus eaque eos in et. Aut minima rerum est natus voluptatibus vitae.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d6e6-73fa-843c-b3d59f3fbd79', 'Ratione optio libero.', '019eb79a-b4a2-72bd-a0a1-77f58a40e105', 'https://via.placeholder.com/640x480.png/00ccaa?text=aut', 'Eos culpa cumque ducimus dignissimos nemo molestias sit. Rerum vel voluptates excepturi fugit facilis. Adipisci deserunt et ut sed. Qui animi quae illo quo suscipit sint.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d6fe-7163-989f-8428ac529756', 'Aliquam quia.', '019eb79a-b4a2-72bd-a0a1-77f58a40e105', 'https://via.placeholder.com/640x480.png/006622?text=amet', 'Quo id quae earum odit. Ea quo pariatur nemo cumque explicabo amet et voluptas. Repellat optio nostrum corrupti velit ex iste qui.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d720-7273-9aea-d9058f31eb85', 'Dolorum porro architecto voluptatem.', '019eb79a-b4a2-72bd-a0a1-77f58a40e105', 'https://via.placeholder.com/640x480.png/0077dd?text=nostrum', 'Quos odit ut officiis. Nobis quisquam nihil quae earum ut facere. Ut voluptatibus voluptate et vel qui consectetur. Aut non nam alias et eum et.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d738-71a0-869a-9635702018d2', 'Animi quia quasi.', '019eb79a-b480-7024-ae70-57cbfbebc212', 'https://via.placeholder.com/640x480.png/00ee55?text=in', 'Esse eum nesciunt ea quia non nesciunt. Enim totam ut voluptas. Explicabo quasi voluptas qui nulla nemo velit ipsum. Porro repellat molestiae est magnam cumque rerum.', '2026-06-11 16:53:58', '2026-06-11 16:53:58');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` char(36) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `libelle`, `description`, `created_at`, `updated_at`) VALUES
('019eb79a-b436-724d-9394-ccdc0f8d0257', 'Primaire', 'Enseignement primaire', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b460-736b-9263-439595727d1e', 'Collège', 'Enseignement secondaire collégial', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b480-7024-ae70-57cbfbebc212', 'Lycée', 'Enseignement secondaire qualifiant', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b4a2-72bd-a0a1-77f58a40e105', 'Près-scolaire', 'Enseignement préscolaire', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b4c4-71b8-89fb-227bd3695d4d', 'Robotos', 'Matériel de robotique et informatique', '2026-06-11 16:53:49', '2026-06-11 16:53:49');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` char(36) NOT NULL,
  `representant_id` char(36) DEFAULT NULL,
  `destination_id` char(36) DEFAULT NULL,
  `raison_sociale` varchar(255) NOT NULL,
  `ice` varchar(20) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `adresse` text,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clients_destination_id_foreign` (`destination_id`),
  KEY `clients_representant_id_index` (`representant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `representant_id`, `destination_id`, `raison_sociale`, `ice`, `ville`, `adresse`, `tel`, `email`, `created_at`, `updated_at`) VALUES
('019eb79a-d5a1-7287-a6b7-d52e5ac05bee', '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Hebert', '904296756202527', 'Peltier', '902, avenue Le Roux\n49354 Dupuy', '0203665947', 'glouis@example.org', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d5bb-73be-94b9-3ca1d557db9c', NULL, '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Barre Duhamel SARL', '726389841500640', 'Diallo', 'rue Xavier Benard\n78320 Rocher', '0306089950', 'mhumbert@example.org', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d5d3-7251-83b2-b6fbb99fa46f', '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b413-7217-92e8-ad64149a5838', 'Rousseau', '111277012220098', 'Wagner-la-Forêt', '37, rue de Pons\n86050 Charpentier-sur-Collet', '+33 (0)2 07 33 88 30', 'gregoire87@example.org', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d604-7076-ade8-77168c9a9c78', '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Poulain Vasseur S.A.R.L.', '775182166903918', 'Bruneaunec', '79, rue Robert Leclerc\n85331 Lecomte', '+33 1 85 33 13 62', 'bphilippe@example.net', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d61e-70e5-972b-99df003f1b1c', '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b413-7217-92e8-ad64149a5838', 'Parent S.A.R.L.', '222846186841820', 'Diaz', '91, place Bertrand Martin\n46418 Toussaint-sur-Blanc', '+33 3 58 65 34 54', 'anais.lebrun@example.org', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d636-734b-9f30-8bf73796369e', '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Chartier', '194363578478041', 'Remy-sur-Alves', '152, rue Gérard Bertrand\n23979 Clement', '02 84 37 28 13', 'prevost.benjamin@example.net', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d650-73a1-b0c2-c654ad9191b2', '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b413-7217-92e8-ad64149a5838', 'Bigot Roche S.A.S.', '762728975406973', 'Legrand', 'impasse Timothée Renault\n15896 Remy', '+33 (0)9 51 27 80 22', 'pottier.francois@example.net', '2026-06-11 16:53:58', '2026-06-11 16:53:58');

-- --------------------------------------------------------

--
-- Table structure for table `client_remboursements`
--

DROP TABLE IF EXISTS `client_remboursements`;
CREATE TABLE IF NOT EXISTS `client_remboursements` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `client_id` char(36) DEFAULT NULL,
  `date_payment` date NOT NULL,
  `banque_nom` varchar(100) DEFAULT NULL,
  `banque_id` char(36) DEFAULT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `cheque_image_path` varchar(255) DEFAULT NULL,
  `a_lordre_de` varchar(255) DEFAULT NULL,
  `montant` decimal(15,2) NOT NULL,
  `observation` text,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_remboursements_season_id_foreign` (`season_id`),
  KEY `client_remboursements_banque_id_foreign` (`banque_id`),
  KEY `client_remboursements_rep_id_index` (`rep_id`),
  KEY `client_remboursements_client_id_index` (`client_id`),
  KEY `client_remboursements_date_payment_index` (`date_payment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client_remboursements`
--

INSERT INTO `client_remboursements` (`id`, `season_id`, `entity_type`, `rep_id`, `client_id`, `date_payment`, `banque_nom`, `banque_id`, `cheque_number`, `cheque_image_path`, `a_lordre_de`, `montant`, `observation`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79b-09ea-70d6-be6b-5c33a40bdfc7', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-d636-734b-9f30-8bf73796369e', '1988-02-29', 'Nicolas Bank', '019eb79a-b5f6-70aa-ab23-a7aa14e189a5', '7480920498', NULL, 'Sophie Faivre', 9560.53, 'Aut aut suscipit et alias quia.', 'Vel et cum dicta quidem et quia.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0a24-73b6-9687-2891f0d99810', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-d650-73a1-b0c2-c654ad9191b2', '1977-01-02', 'Lecomte Bank', '019eb79a-b5dd-72ae-bbbc-45f155dc57c8', '2251791316', NULL, 'Adrien-Émile Perret', 277.93, 'Natus esse vero numquam voluptas non qui omnis.', 'Optio magnam magni reiciendis vel laborum.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0a66-70b3-895e-8798db7ff71b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-d61e-70e5-972b-99df003f1b1c', '2007-07-31', 'Hamel Bank', '019eb79a-b659-708b-b2be-21b37409e8ec', '9905169683', NULL, 'Benoît Leleu', 4108.67, 'Officia necessitatibus id excepturi labore et tempora voluptatem.', 'Occaecati nulla ut beatae est.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0ac0-726d-8eff-19b9cb7c3db0', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-d636-734b-9f30-8bf73796369e', '1997-09-24', 'Lebreton S.A.S. Bank', '019eb79a-bad3-7352-a381-13c4f25a97b0', '7667688652', NULL, 'Vincent Le Lombard', 4421.16, 'Officia est esse enim non rerum occaecati.', 'Non unde est enim fugit.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0ae6-71d4-805f-3bf727ebed48', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-d5d3-7251-83b2-b6fbb99fa46f', '1988-02-25', 'Blanchard Bank', '019eb79a-ba6c-71d8-8bfd-3bff7eb3db13', '9028624626', NULL, 'Julie Petitjean', 9347.95, 'Beatae consequuntur voluptatum eveniet et maxime.', 'Ut ut veniam magnam odit.', '2026-06-11 16:54:11', '2026-06-11 16:54:11'),
('019eb79b-0b45-72c6-ae87-83599e83b1da', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-d604-7076-ade8-77168c9a9c78', '1982-02-05', 'Alves Bank', '019eb79a-b5c0-715b-bbcb-e1bca5a93860', '2086901320', NULL, 'Élisabeth-Arnaude Legros', 1375.50, 'Quia voluptate placeat quibusdam vero.', 'Aut perspiciatis voluptas quibusdam.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0b99-718c-9a1b-e75245bf8020', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-d5a1-7287-a6b7-d52e5ac05bee', '2021-12-19', 'Fernandez S.A.S. Bank', '019eb79a-b6bd-7376-84fc-d099d8a1a0e8', '7001820271', NULL, 'Jean Gallet', 2125.90, 'Et qui dolorem accusamus accusantium quas voluptatem.', 'Ratione explicabo omnis rerum et maxime corporis.', '2026-06-11 16:54:12', '2026-06-11 16:54:12');

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

DROP TABLE IF EXISTS `contents`;
CREATE TABLE IF NOT EXISTS `contents` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `champ1` text,
  `champ2` text,
  `champ3` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `type`, `champ1`, `champ2`, `champ3`, `created_at`, `updated_at`) VALUES
('019eb79a-be31-72c6-b7d4-86f3ce90cada', 'doloremque', 'Neque autem molestias molestiae ut esse dolores ut.', 'Molestiae eveniet facilis excepturi repudiandae.', 'Consequuntur sed cumque necessitatibus.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-be4e-7268-a251-13926935b565', 'autem', 'Architecto et aut nesciunt ut consequatur nemo temporibus.', 'Itaque odit tempora consequatur qui sed soluta.', 'Est incidunt ea eius molestiae aliquam.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-be6f-71b5-8fee-a6f1237421b7', 'tenetur', 'Aperiam architecto in non iusto est laudantium enim.', 'Laboriosam aut et quia deleniti.', 'Quidem provident consectetur praesentium reprehenderit nihil minus.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bea1-73ae-bb52-26f5b1948ec1', 'ullam', 'Quaerat repellendus natus ut ad commodi nostrum minus.', 'Asperiores quae eligendi ut omnis sunt eos.', 'Consequatur quam iste earum cumque odit voluptatem.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bec2-72aa-acb0-d8f7f3da518c', 'veritatis', 'Eius neque eligendi debitis deserunt magnam.', 'Ratione laudantium voluptatum ab.', 'Enim quis qui et quaerat quia.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bee3-7392-8236-7e1c98187304', 'rerum', 'Minima quia aut sed veritatis minima nam nihil cumque.', 'Esse dolorem veniam enim reprehenderit aut.', 'Voluptas dolores id dignissimos illum aperiam.', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bf04-7332-9a8f-df6cecb0c275', 'nihil', 'Est voluptatibus occaecati ea illum explicabo a occaecati.', 'Aut molestiae veniam voluptas libero soluta qui.', 'Error voluptas id dolor ducimus molestias libero nobis.', '2026-06-11 16:53:52', '2026-06-11 16:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `demande_f`
--

DROP TABLE IF EXISTS `demande_f`;
CREATE TABLE IF NOT EXISTS `demande_f` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `date_demande` date NOT NULL,
  `ref` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `statut` int NOT NULL,
  `livree` int NOT NULL DEFAULT '0',
  `contenu` text,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `demande_f_season_id_foreign` (`season_id`),
  KEY `demande_f_rep_id_index` (`rep_id`),
  KEY `demande_f_client_id_index` (`client_id`),
  KEY `demande_f_statut_index` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `demande_f`
--

INSERT INTO `demande_f` (`id`, `season_id`, `entity_type`, `rep_id`, `client_id`, `date_demande`, `ref`, `type`, `statut`, `livree`, `contenu`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79b-0e36-7187-8f52-cfd665dced76', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-d5bb-73be-94b9-3ca1d557db9c', '1983-08-07', 6, 'MSM', 1, 0, 'Ad dicta necessitatibus at distinctio. Est blanditiis illum est nihil facilis a sed. Accusantium sint eligendi dolor error et.', 'Repudiandae omnis qui odit et magnam voluptatem quas ut.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0e7b-7068-858a-d3776fb3fad0', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-d5d3-7251-83b2-b6fbb99fa46f', '2014-02-10', 5, 'Wataniya', 0, 0, 'Dolor itaque ea quia dolorem corporis. Explicabo autem suscipit amet similique aperiam maiores atque. In et qui harum praesentium ut adipisci minus.', 'Voluptate et in hic quis eveniet.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0ee9-7160-a7a3-2971d3b7cfdf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-d5a1-7287-a6b7-d52e5ac05bee', '1981-07-16', 4, 'MSM', 0, 0, 'Consequatur repellat similique est quasi. Nemo praesentium aut a non quia hic distinctio. Non dicta nihil non aut accusamus distinctio. Autem et minima ut qui est repellat.', 'Nostrum consectetur at quis quisquam tempora dicta laborum.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0f0b-721b-81bc-40097eb2db54', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-d5a1-7287-a6b7-d52e5ac05bee', '2006-11-20', 5, 'Wataniya', 0, 0, 'Libero omnis eos voluptate illum. Iure sed dolorem itaque dolores. Rerum dolor et cum consequatur eius earum. In id quia repudiandae quaerat excepturi voluptas accusantium.', 'Sed delectus dolorum necessitatibus ducimus maxime dolorem architecto.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-0f34-713d-8989-5866139f50d6', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-d650-73a1-b0c2-c654ad9191b2', '1973-02-10', 9, 'Wataniya', 0, 0, 'Quo non rerum enim velit vero tempora sunt. Atque numquam cum harum possimus est natus. Similique aut sint vel iusto et. Excepturi perferendis in et illo mollitia.', 'Facere quod rerum in magni quo.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-0f4b-7316-8633-b45cb094409a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-d5a1-7287-a6b7-d52e5ac05bee', '1976-02-28', 6, 'MSM', 0, 0, 'Accusamus voluptatibus voluptatum inventore dolores. Perspiciatis qui perferendis ut quia voluptatibus. Molestias aperiam sit quia maxime ad. Ex maiores id eaque.', 'Amet voluptas itaque et unde ipsam.', '2026-06-11 16:54:13', '2026-06-11 16:54:13');

-- --------------------------------------------------------

--
-- Table structure for table `depots`
--

DROP TABLE IF EXISTS `depots`;
CREATE TABLE IF NOT EXISTS `depots` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `livre_id` char(36) DEFAULT NULL,
  `type` text,
  `quantite_balance` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `depots_rep_id_livre_id_unique` (`rep_id`,`livre_id`),
  KEY `depots_season_id_foreign` (`season_id`),
  KEY `depots_rep_id_index` (`rep_id`),
  KEY `depots_livre_id_index` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `depots`
--

INSERT INTO `depots` (`id`, `season_id`, `entity_type`, `rep_id`, `livre_id`, `type`, `quantite_balance`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79a-c294-72fe-a8f0-44f86d14c7ad', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b739-72bd-b803-663617062539', NULL, 856, 0, 'Quam rerum voluptas a sed eaque animi ad.', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c3b8-7309-b742-42502cc4ac1d', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b774-716a-9180-e4cb14612d79', NULL, 229, 0, 'Deserunt hic aut quo et reprehenderit.', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c3d2-7245-9656-a92f83b0ac8b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b796-73a2-8425-af22e02c02ec', NULL, 925, 1, 'Repellat sit dolor aut dignissimos necessitatibus.', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c3ed-72f7-8e92-d5cfb224d45a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b7f8-72cd-a9dc-1cf107359940', NULL, 919, 0, 'Quia natus enim est eos et unde architecto voluptas.', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c40d-72b5-9597-ca70e674921c', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b811-7252-9728-eebaeb18a6ef', NULL, 175, 1, 'Unde velit qui nobis ratione ab inventore.', '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c69f-707e-9c71-7fa77c95fb31', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b70d-705a-a02c-233b09d25488', NULL, 615, 1, 'Excepturi consequatur atque est reprehenderit quia dolorum.', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c6bf-70a5-afc3-0c506a6bfe2e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b7b8-730c-879f-8ee12d3af397', NULL, 766, 1, 'Qui consequuntur quia repellendus est.', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c6e1-723e-ab75-4a504888e08b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', NULL, 516, 1, 'Aut repudiandae minima tenetur voluptate reiciendis.', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c702-70cb-8884-e4aea8a07df2', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b7f8-72cd-a9dc-1cf107359940', NULL, 930, 1, 'Ut aut enim aut minus.', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c72b-73f4-ad98-30f6a322b5f5', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', NULL, 985, 1, 'Nam animi odio velit aut vel qui.', '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c9df-702d-8083-7621b766d8e3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b796-73a2-8425-af22e02c02ec', NULL, 124, 1, 'Voluptatem inventore omnis nulla alias et dolores.', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-c9fd-7098-9b3f-159985caef87', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b7b8-730c-879f-8ee12d3af397', NULL, 145, 0, 'Et reprehenderit dolor aut quaerat accusamus inventore magnam voluptas.', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-ca1f-7098-b6cf-d073cd4ff5d2', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', NULL, 137, 1, 'Aspernatur nobis sint ab necessitatibus culpa mollitia.', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-ca40-7148-86fb-6f2613c2276e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b7f8-72cd-a9dc-1cf107359940', NULL, 736, 0, 'Quia voluptatem omnis optio perferendis maxime beatae facere.', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-ca61-7196-bd39-bd8cb0eabd19', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b811-7252-9728-eebaeb18a6ef', NULL, 553, 0, 'Deleniti expedita in quibusdam cumque ea.', '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-cd01-73ab-8b07-16e4fcc3ad42', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b70d-705a-a02c-233b09d25488', NULL, 512, 1, 'Doloribus reiciendis molestias quia molestiae magni consequuntur.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-cd66-700c-a654-c501045cef79', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b774-716a-9180-e4cb14612d79', NULL, 71, 0, 'Distinctio quaerat architecto ipsam autem eius.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-cd90-7115-b725-26e152bec6b6', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b796-73a2-8425-af22e02c02ec', NULL, 896, 0, 'Rem repudiandae quisquam consequuntur voluptates laudantium.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-cdb1-722d-8543-a9e3d957343f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', NULL, 907, 1, 'Deserunt eveniet animi rerum voluptatem deserunt nemo.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-cdd2-7255-8ab5-328fcf7e7dc1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', NULL, 522, 0, 'Quo est deserunt ad nobis placeat minima veniam voluptas.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-d07b-7236-b5ee-0b968836b0f1', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b796-73a2-8425-af22e02c02ec', NULL, 395, 0, 'Consequatur non ipsum tempora qui.', '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-d0b6-72c5-816a-1355af61c2e3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b7b8-730c-879f-8ee12d3af397', NULL, 87, 0, 'Doloribus enim quasi sed.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d107-724a-98c8-4ee18c96d798', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', NULL, 210, 0, 'Suscipit qui porro qui qui.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d149-7117-b889-5aa6ff1d40bc', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b811-7252-9728-eebaeb18a6ef', NULL, 528, 1, 'Animi eum pariatur omnis officiis voluptas quia.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d16d-7366-810e-b198616999dc', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', NULL, 168, 1, 'Dolore iure rerum neque iste tempore ut.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d2e2-73ef-bccf-e05c8e2edd27', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b70d-705a-a02c-233b09d25488', NULL, 727, 1, 'Enim similique tempore occaecati a deleniti eos.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d302-71de-9ff4-185f819ee280', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b739-72bd-b803-663617062539', NULL, 584, 1, 'Et laboriosam provident magni eius deleniti.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d326-722e-b0fc-ff25b14d22cb', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b7d8-7399-8d07-e2824c35bd5c', NULL, 791, 1, 'Ratione qui sunt est dicta officiis nihil impedit.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d346-736e-8b49-f35f2acf2caf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b7f8-72cd-a9dc-1cf107359940', NULL, 132, 1, 'Non eos sit atque impedit.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d367-709c-862a-5c1ee4ab764f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b811-7252-9728-eebaeb18a6ef', NULL, 186, 0, 'Iste laboriosam et nostrum in occaecati sed voluptatem.', '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d4e6-709b-9c11-84dfd48ea542', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b70d-705a-a02c-233b09d25488', NULL, 392, 1, 'Incidunt et deleniti minus blanditiis minus.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d505-70e1-bb11-b563ca5b27cc', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b739-72bd-b803-663617062539', NULL, 255, 1, 'Est fugiat adipisci autem adipisci vel officia.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d528-7159-a70b-979263392554', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b7f8-72cd-a9dc-1cf107359940', NULL, 692, 0, 'Placeat repudiandae ut sit sit.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d548-70ad-92a1-6f6c4b4f3a65', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b811-7252-9728-eebaeb18a6ef', NULL, 806, 1, 'Alias id nulla quia est cum nemo dolor.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d56b-718d-9178-224247f0cb43', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', NULL, 792, 1, 'Ut voluptate eum debitis et sunt quos.', '2026-06-11 16:53:58', '2026-06-11 16:53:58');

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` char(36) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `destination`, `description`, `created_at`, `updated_at`) VALUES
('019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Marrakech', '', '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b413-7217-92e8-ad64149a5838', 'Settat', '', '2026-06-11 16:53:49', '2026-06-11 16:53:49');

-- --------------------------------------------------------

--
-- Table structure for table `det_fact`
--

DROP TABLE IF EXISTS `det_fact`;
CREATE TABLE IF NOT EXISTS `det_fact` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `fact_id` char(36) NOT NULL,
  `livre_id` char(36) DEFAULT NULL,
  `quantite` int NOT NULL DEFAULT '1',
  `prix_unitaire_ht` decimal(15,2) NOT NULL,
  `remise` decimal(5,2) NOT NULL DEFAULT '0.00',
  `total_ligne_ht` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `det_fact_season_id_foreign` (`season_id`),
  KEY `det_fact_fact_id_index` (`fact_id`),
  KEY `det_fact_livre_id_index` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `det_fact`
--

INSERT INTO `det_fact` (`id`, `season_id`, `entity_type`, `fact_id`, `livre_id`, `quantite`, `prix_unitaire_ht`, `remise`, `total_ligne_ht`, `created_at`, `updated_at`) VALUES
('019eb79b-11ca-7327-aeb6-5b3525e3d78e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-1034-72d1-8232-5a340e092bdf', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 11, 142.35, 17.35, 1294.18, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-11e4-7091-bd04-51407ba0ad89', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-1034-72d1-8232-5a340e092bdf', '019eb79a-b754-7192-ba3d-38664ad3c555', 27, 95.00, 9.85, 2312.35, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-11f7-70d5-b5ae-07862de027fd', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-101d-70dd-b17d-f51d4319eb1f', '019eb79a-b811-7252-9728-eebaeb18a6ef', 6, 178.88, 14.77, 914.76, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1220-734d-9220-8de6ebcb6c74', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-1034-72d1-8232-5a340e092bdf', '019eb79a-b739-72bd-b803-663617062539', 89, 143.63, 0.91, 12666.74, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1236-7131-894d-73f480807703', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-0ff4-70be-9779-7978581d656e', '019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 49, 49.27, 18.73, 1962.04, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-124a-70a8-b745-c155e0ad6530', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-1034-72d1-8232-5a340e092bdf', '019eb79a-b7f8-72cd-a9dc-1cf107359940', 9, 29.34, 12.48, 231.11, '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1260-7317-b015-a267303651f6', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79b-0ff4-70be-9779-7978581d656e', '019eb79a-b739-72bd-b803-663617062539', 71, 162.81, 13.45, 10004.76, '2026-06-11 16:54:13', '2026-06-11 16:54:13');

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` char(36) NOT NULL,
  `destinataire` varchar(255) NOT NULL,
  `sujet` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'email',
  `statut` varchar(50) NOT NULL DEFAULT 'envoyé',
  `emetteur_type` varchar(255) DEFAULT NULL,
  `emetteur_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_logs_emetteur_index` (`emetteur_type`,`emetteur_id`),
  KEY `email_logs_created_at_index` (`created_at`),
  KEY `email_logs_statut_index` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fact`
--

DROP TABLE IF EXISTS `fact`;
CREATE TABLE IF NOT EXISTS `fact` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `sequence_id` char(36) DEFAULT NULL,
  `demande_id` char(36) DEFAULT NULL,
  `year_session` varchar(9) DEFAULT NULL,
  `number` int NOT NULL,
  `fact_number` varchar(50) DEFAULT NULL,
  `date_facture` date NOT NULL,
  `total_ht` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tva_rate` decimal(5,2) NOT NULL DEFAULT '20.00',
  `total_ttc` decimal(15,2) NOT NULL DEFAULT '0.00',
  `reste_a_payer` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('Brouillon','Validée','Payée','Annulée') NOT NULL DEFAULT 'Brouillon',
  `remarques` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fact_year_session_number_unique` (`year_session`,`number`),
  UNIQUE KEY `fact_fact_number_unique` (`fact_number`),
  KEY `fact_season_id_foreign` (`season_id`),
  KEY `fact_sequence_id_foreign` (`sequence_id`),
  KEY `fact_demande_id_foreign` (`demande_id`),
  KEY `fact_rep_id_index` (`rep_id`),
  KEY `fact_year_session_index` (`year_session`),
  KEY `fact_date_facture_index` (`date_facture`),
  KEY `fact_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fact`
--

INSERT INTO `fact` (`id`, `season_id`, `entity_type`, `rep_id`, `sequence_id`, `demande_id`, `year_session`, `number`, `fact_number`, `date_facture`, `total_ht`, `tva_rate`, `total_ttc`, `reste_a_payer`, `status`, `remarques`, `created_at`, `updated_at`) VALUES
('019eb79b-0f8f-737d-9c59-d20b4109a404', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-bb58-70b6-b396-c6e91fa70154', '019eb79b-0f0b-721b-81bc-40097eb2db54', '1973', 6305, 'FACT-2963', '1988-07-10', 3502.30, 20.00, 4202.76, 0.00, 'Brouillon', 'Temporibus et itaque omnis quo accusamus quis cumque.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-0fc1-73b0-a8ba-881ea14e8493', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-bbce-71b2-b804-83e1e128f5e5', NULL, '2005', 3731, 'FACT-0241', '2001-07-12', 4438.97, 20.00, 5326.76, 0.00, 'Annulée', 'Molestias iusto qui et dolorem excepturi cum quis.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-0ff4-70be-9779-7978581d656e', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-bbad-7195-ba77-d51b8fb2e244', NULL, '2012', 5017, 'FACT-7106', '1998-08-10', 2952.45, 20.00, 3542.94, 0.00, 'Validée', 'Omnis et quis earum non culpa.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-100a-70e0-b592-6d68ef405565', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-bbce-71b2-b804-83e1e128f5e5', '019eb79b-0f34-713d-8989-5866139f50d6', '2017', 8827, 'FACT-0040', '1986-01-28', 3892.37, 20.00, 4670.84, 0.00, 'Validée', 'Veritatis ut iure nam id dolorem quos.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-101d-70dd-b17d-f51d4319eb1f', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-bb3f-7094-9981-825152c09712', '019eb79b-0e7b-7068-858a-d3776fb3fad0', '1989', 7904, 'FACT-0593', '1999-07-11', 4006.92, 20.00, 4808.30, 0.00, 'Validée', 'Aliquid alias omnis accusantium.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1034-72d1-8232-5a340e092bdf', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-bb58-70b6-b396-c6e91fa70154', NULL, '2002', 1301, 'FACT-5136', '2009-06-25', 159.53, 20.00, 191.44, 0.00, 'Brouillon', 'Neque officiis possimus illo perspiciatis enim.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1046-71b0-80ab-841547e7082b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79a-bb3f-7094-9981-825152c09712', '019eb79b-0e7b-7068-858a-d3776fb3fad0', '1974', 2907, 'FACT-5789', '1973-01-08', 2249.70, 20.00, 2699.64, 0.00, 'Brouillon', 'Maxime voluptatibus eaque dolores ut tempora ut pariatur.', '2026-06-11 16:54:13', '2026-06-11 16:54:13');

-- --------------------------------------------------------

--
-- Table structure for table `fact_sequences`
--

DROP TABLE IF EXISTS `fact_sequences`;
CREATE TABLE IF NOT EXISTS `fact_sequences` (
  `id` char(36) NOT NULL,
  `nom` varchar(9) NOT NULL,
  `dernier_numero` int NOT NULL DEFAULT '0',
  `est_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fact_sequences_nom_unique` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fact_sequences`
--

INSERT INTO `fact_sequences` (`id`, `nom`, `dernier_numero`, `est_active`, `created_at`, `updated_at`) VALUES
('019eb79a-bb22-7293-af12-3eb901796d45', '1070-8751', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bb3f-7094-9981-825152c09712', '1960-0265', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bb58-70b6-b396-c6e91fa70154', '4885-2294', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bb8c-702e-9552-f827c4bbcc68', '7651-1751', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bbad-7195-ba77-d51b8fb2e244', '7879-4945', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bbce-71b2-b804-83e1e128f5e5', '0145-5846', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-bbef-7389-a48b-289070bafdb6', '4342-5783', 0, 1, '2026-06-11 16:53:51', '2026-06-11 16:53:51');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imprimeurs`
--

DROP TABLE IF EXISTS `imprimeurs`;
CREATE TABLE IF NOT EXISTS `imprimeurs` (
  `id` char(36) NOT NULL,
  `raison_sociale` varchar(255) NOT NULL,
  `adresse` text,
  `directeur_nom` varchar(255) DEFAULT NULL,
  `directeur_tel` varchar(20) DEFAULT NULL,
  `directeur_email` varchar(255) DEFAULT NULL,
  `adjoint_nom` varchar(255) DEFAULT NULL,
  `adjoint_tel` varchar(20) DEFAULT NULL,
  `adjoint_email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `imprimeurs`
--

INSERT INTO `imprimeurs` (`id`, `raison_sociale`, `adresse`, `directeur_nom`, `directeur_tel`, `directeur_email`, `adjoint_nom`, `adjoint_tel`, `adjoint_email`, `created_at`, `updated_at`) VALUES
('019eb79a-b517-7033-832f-47fb744ca39e', 'watanya', 'Casablanca, Morocco', 'Directeur Watanya', NULL, NULL, NULL, NULL, NULL, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b560-709c-86d3-05e7048ec41c', 'BEST BM', 'Rabat, Morocco', 'Directeur BEST BM', NULL, NULL, NULL, NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b8bb-73e6-80e0-db4098843426', 'Lambert', '438, impasse de Fontaine\n07817 Lebrundan', 'Joséphine Courtois', '07 40 23 10 67', 'elise.valette@legoff.fr', 'Étienne Petit-Guillot', '0432933193', 'zleveque@example.com', '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b90b-73f2-913b-b3579c4ce05f', 'Renaud', '317, boulevard de Leconte\n18482 Bousquet-sur-Payet', 'Valérie de Arnaud', '01 83 75 84 86', 'zguillon@texier.net', 'Augustin Andre', '0229959166', 'christiane.perret@example.com', '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b95e-7399-91e1-a39df72fb9be', 'Dias', '88, boulevard Benard\n94390 Ollivier', 'Françoise Joseph', '08 19 13 78 50', 'benoit73@antoine.fr', 'Paulette Auger', '+33 4 03 20 14 77', 'joly.denis@example.com', '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-b9a9-7341-ac51-2b706d2bc042', 'Olivier', '24, boulevard Monnier\n31424 Valette', 'Dorothée de Dumas', '0201048401', 'henry.noemi@marchal.org', 'Jean-Jean Pages', '+33 1 56 04 81 85', 'dleveque@example.net', '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-ba00-7344-8abd-0792b682a822', 'Gilles', '70, rue Weiss\n42960 Guerin', 'Olivie Le Goff', '07 41 03 63 76', 'qbousquet@delahaye.fr', 'Zoé Vallee', '+33 6 59 12 08 83', 'tverdier@example.org', '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-ba36-7133-be3e-3d7d2f7f3c52', 'Valette Besson S.A.R.L.', '33, rue de Chevalier\n25840 Fleury', 'Chantal Albert', '+33 6 14 94 26 32', 'maury.emile@bourdon.com', 'Nicole du Francois', '04 34 95 64 15', 'margaret.lelievre@example.net', '2026-06-11 16:53:51', '2026-06-11 16:53:51'),
('019eb79a-ba4f-72bc-aec8-bc69ba6f0a27', 'Becker', 'impasse de Costa\n51217 Turpinboeuf', 'Roger Chevalier', '+33 (0)1 87 75 97 02', 'victor.briand@perez.net', 'Maggie Blondel', '0236245118', 'caroline29@example.net', '2026-06-11 16:53:51', '2026-06-11 16:53:51');

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
CREATE TABLE IF NOT EXISTS `invitations` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'représentant',
  `message` text,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en attente',
  `emetteur_type` varchar(255) DEFAULT NULL,
  `emetteur_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitations_token_unique` (`token`),
  KEY `emetteur` (`emetteur_type`,`emetteur_id`),
  KEY `invitations_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `livres`
--

DROP TABLE IF EXISTS `livres`;
CREATE TABLE IF NOT EXISTS `livres` (
  `id` char(36) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `categorie_id` char(36) DEFAULT NULL,
  `prix_achat` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prix_vente` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prix_public` decimal(10,2) NOT NULL DEFAULT '0.00',
  `nb_pages` int UNSIGNED NOT NULL DEFAULT '0',
  `color_code` varchar(7) NOT NULL DEFAULT '#FFFFFF',
  `description` text,
  `annee_publication` varchar(4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `livres_code_unique` (`code`),
  KEY `livres_categorie_id_index` (`categorie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `livres`
--

INSERT INTO `livres` (`id`, `titre`, `code`, `categorie_id`, `prix_achat`, `prix_vente`, `prix_public`, `nb_pages`, `color_code`, `description`, `annee_publication`, `created_at`, `updated_at`) VALUES
('019eb79a-b70d-705a-a02c-233b09d25488', 'Informatique et Robotique au primaire N 1', 'R1', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 40, '#00DDFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b739-72bd-b803-663617062539', 'Informatique et Robotique au primaire N 2', 'R2', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 40, '#00DDFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b754-7192-ba3d-38664ad3c555', 'Informatique et Robotique au primaire N 3', 'R3', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 48, '#00DDFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b774-716a-9180-e4cb14612d79', 'Informatique et Robotique au primaire N 4', 'R4', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 56, '#00DDFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b796-73a2-8425-af22e02c02ec', 'Informatique et Robotique au primaire N 5', 'R5', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 56, '#00DDFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b7b8-730c-879f-8ee12d3af397', 'Informatique et Robotique au primaire N 6', 'R6', '019eb79a-b436-724d-9394-ccdc0f8d0257', 10.00, 15.00, 20.00, 56, '#FFFFFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b7d8-7399-8d07-e2824c35bd5c', 'Informatique, Robotique et Intelligence Artificielle au collège N1', 'IA7', '019eb79a-b460-736b-9263-439595727d1e', 20.00, 35.00, 40.00, 96, '#FFFFFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b7f8-72cd-a9dc-1cf107359940', 'Informatique, Robotique et Intelligence Artificielle au collège N2', 'IA8', '019eb79a-b460-736b-9263-439595727d1e', 20.00, 35.00, 40.00, 80, '#FFFFFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b811-7252-9728-eebaeb18a6ef', 'mBot', 'mBot', '019eb79a-b4c4-71b8-89fb-227bd3695d4d', 300.00, 400.00, 500.00, 0, '#FFFFFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50'),
('019eb79a-b82d-70f9-9efb-5aad5c6c32e8', 'Thymio', 'Thy', '019eb79a-b4c4-71b8-89fb-227bd3695d4d', 100.00, 200.00, 300.00, 0, '#FFFFFF', NULL, NULL, '2026-06-11 16:53:50', '2026-06-11 16:53:50');

-- --------------------------------------------------------

--
-- Table structure for table `logins`
--

DROP TABLE IF EXISTS `logins`;
CREATE TABLE IF NOT EXISTS `logins` (
  `id` char(36) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `authenticatable_id` char(36) NOT NULL,
  `authenticatable_type` varchar(255) NOT NULL,
  `role` enum('admin','representant') NOT NULL DEFAULT 'representant',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_online` tinyint(1) NOT NULL DEFAULT '0',
  `last_visit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `logins_username_unique` (`username`),
  KEY `logins_authenticatable_id_authenticatable_type_index` (`authenticatable_id`,`authenticatable_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `logins`
--

INSERT INTO `logins` (`id`, `username`, `password`, `authenticatable_id`, `authenticatable_type`, `role`, `is_active`, `is_online`, `last_visit`, `remember_token`, `created_at`, `updated_at`) VALUES
('019eb79a-b6e0-701a-9f3b-fd9d0765c863', 'admin', '$2y$12$bGhlzO//3s7dJpvuQ1w.AeDZAZaqy3lEPLpupOmn2WjNIwMIDNWZi', '019eb79a-b3a8-730d-b050-a5884f161a63', 'App\\Models\\Admin', 'admin', 1, 1, '2026-06-11 21:27:48', NULL, '2026-06-11 16:53:50', '2026-06-11 21:27:48'),
('019eb79a-c25a-7302-b7b2-0b369b6a6e3f', 'jregnier', '$2y$12$MuSWbjg/y81JuSu0tXksiOGKE7BPrknpoItAbvK3m/Dn52amPn8da', '019eb79a-bf4f-714e-84d0-5e7d1b8007d3', 'App\\Models\\Representant', 'representant', 0, 0, '2018-08-19 05:15:09', NULL, '2026-06-11 16:53:53', '2026-06-11 16:53:53'),
('019eb79a-c67f-71df-ac6a-9b68623939f2', 'xdavid', '$2y$12$d/AALRObKjKzzid6.2HuA.Y95A1aCWdYknXk5IB1uStaUnIJPQbnq', '019eb79a-bf6e-7324-ab86-0be7f09aaf54', 'App\\Models\\Representant', 'representant', 0, 0, '1998-07-22 06:30:44', NULL, '2026-06-11 16:53:54', '2026-06-11 16:53:54'),
('019eb79a-c9b7-73ae-b5fa-61907bdd893a', 'andree94', '$2y$12$LhIhYNMVKyqlX/o.rl9e5eIQyyXhWj/ZPFSPW71lfX/Y36SKW3aLi', '019eb79a-bf88-70cc-a6da-67b035f5b3fa', 'App\\Models\\Representant', 'representant', 0, 0, '2015-11-16 02:27:49', NULL, '2026-06-11 16:53:55', '2026-06-11 16:53:55'),
('019eb79a-ccc6-715a-9134-9393f3218ca9', 'plamy', '$2y$12$jysPK5aeEtLZEEW5LO8SNuBJRnNPfuXCVP7TMEz6dFJB9OaZ3NIlu', '019eb79a-bfa0-714e-a2fb-9c4911826581', 'App\\Models\\Representant', 'representant', 0, 0, '1979-03-20 02:14:27', NULL, '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-d036-7041-ae16-8647b25b88fc', 'honore.henry', '$2y$12$Pazjd1.tC9OQbphofqzht.W09EowRMlhSXWItVmZceTsm/MChXK22', '019eb79a-bfba-7039-9176-f49bbdddb678', 'App\\Models\\Representant', 'representant', 0, 0, '1982-04-24 06:39:56', NULL, '2026-06-11 16:53:56', '2026-06-11 16:53:56'),
('019eb79a-d2c8-70e0-b673-bd419fc8ec3a', 'gabriel30', '$2y$12$DTYA/wOsMmcR4FDs..NwHOWxQqO0Ci9HN4zLMrUS.Zn3TSQEU1Nti', '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', 'App\\Models\\Representant', 'representant', 0, 0, '1989-10-31 23:49:36', NULL, '2026-06-11 16:53:57', '2026-06-11 16:53:57'),
('019eb79a-d4b3-7062-a362-14db52d68ea6', 'frousseau', '$2y$12$4/D.vuf/MPnY6.FHrzAXYe1vvLJbx9JZE3/lEcnvAM.3AfWllnjZG', '019eb79a-bfec-7203-9594-987e27b8f474', 'App\\Models\\Representant', 'representant', 1, 0, '1982-04-29 04:21:20', NULL, '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb8c2-8d62-707d-b5e1-4085be550216', 'Mouad', '$2y$12$5PpdXYSaWS3LXGPTu80PveYiOO/sro7myh4DgRa2Z0zRyF9we/AYu', '019eb8c2-8d5d-7032-bd7d-188f3a01ed1c', 'App\\Models\\Representant', 'representant', 1, 0, '2026-06-11 22:16:58', NULL, '2026-06-11 22:16:58', '2026-06-11 22:27:22');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_04_175920_create_personal_access_tokens_table', 1),
(5, '2026_02_05_000001_create_seasons_table', 1),
(6, '2026_02_05_000003_create_settings_table', 1),
(7, '2026_02_05_172150_create_destinations_table', 1),
(8, '2026_02_05_172157_create_admins_table', 1),
(9, '2026_02_05_172623_create_representants_table', 1),
(10, '2026_02_05_172624_create_logins_table', 1),
(11, '2026_02_05_173312_create_banques_table', 1),
(12, '2026_02_05_173313_create_categories_table', 1),
(13, '2026_02_05_175219_create_imprimeurs_table', 1),
(14, '2026_02_05_175721_create_livres_table', 1),
(15, '2026_02_05_180325_create_clients_table', 1),
(16, '2026_02_05_180959_create_catalogues_table', 1),
(17, '2026_02_06_182107_create_b_livraisons_table', 1),
(18, '2026_02_06_183835_create_b_livraison_items_table', 1),
(19, '2026_02_06_185044_create_depots_table', 1),
(20, '2026_02_06_190838_create_b_ventes_clients_table', 1),
(21, '2026_02_06_191344_create_b_livraison_imps_table', 1),
(22, '2026_02_07_171800_create_client_remboursements_table', 1),
(23, '2026_02_07_172708_create_remb_imps_table', 1),
(24, '2026_02_07_173222_create_demande_f_table', 1),
(25, '2026_02_07_173330_create_fact_sequences_table', 1),
(26, '2026_02_07_173331_create_fact_table', 1),
(27, '2026_02_07_173610_create_det_fact_table', 1),
(28, '2026_02_07_182105_create_rep_remboursements_table', 1),
(29, '2026_02_07_182427_create_carte_visites_table', 1),
(30, '2026_02_07_182651_create_cahier_communications_table', 1),
(31, '2026_02_07_183103_create_robots_table', 1),
(32, '2026_04_09_192019_create_contents_table', 1),
(33, '2026_05_06_174047_create_activity_log_table', 1),
(34, '2026_06_02_000001_create_cahier_templates_table', 1),
(35, '2026_06_03_123910_create_email_logs_table', 1),
(36, '2026_06_03_123910_create_invitations_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` char(36) NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Login', '019eb79a-b6e0-701a-9f3b-fd9d0765c863', 'auth_token', '96e44e4e228a6cdb969b2fa6de51c79d9d43b23c01a5d6b2cab8abadc0bd106d', '[\"*\"]', '2026-06-11 21:24:39', NULL, '2026-06-11 16:54:47', '2026-06-11 21:24:39'),
(2, 'App\\Models\\Login', '019eb79a-b6e0-701a-9f3b-fd9d0765c863', 'auth_token', 'e3ee61978dee2ba7b9cc061fbe612a8df1cd599060270f4cece14a54c2be0d9f', '[\"*\"]', '2026-06-11 23:03:45', NULL, '2026-06-11 21:27:49', '2026-06-11 23:03:45');

-- --------------------------------------------------------

--
-- Table structure for table `remb_imp`
--

DROP TABLE IF EXISTS `remb_imp`;
CREATE TABLE IF NOT EXISTS `remb_imp` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `imprimeur_id` char(36) NOT NULL,
  `date_payment` date NOT NULL,
  `banque_nom` varchar(100) DEFAULT NULL,
  `banque_id` char(36) DEFAULT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `cheque_image_path` varchar(255) DEFAULT NULL,
  `montant` decimal(15,2) NOT NULL,
  `statut_recu` tinyint(1) NOT NULL DEFAULT '0',
  `statut_rejete` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `remb_imp_season_id_foreign` (`season_id`),
  KEY `remb_imp_banque_id_foreign` (`banque_id`),
  KEY `remb_imp_imprimeur_id_index` (`imprimeur_id`),
  KEY `remb_imp_date_payment_index` (`date_payment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `remb_imp`
--

INSERT INTO `remb_imp` (`id`, `season_id`, `imprimeur_id`, `date_payment`, `banque_nom`, `banque_id`, `cheque_number`, `cheque_image_path`, `montant`, `statut_recu`, `statut_rejete`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79b-0c22-7240-af4f-1a14accf7862', '019eb79a-b0fd-71c5-8946-c209b28ed84c', '019eb79a-b8bb-73e6-80e0-db4098843426', '2005-08-31', 'Lejeune Bank', '019eb79a-b618-7005-8059-8c365dabcafc', '5203973322', NULL, 39389.33, 0, 1, 'Reiciendis eveniet distinctio et ut itaque dignissimos.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0c58-7069-9fdd-83cbd6e9c3d0', '019eb79a-b26d-71dc-bfeb-2394fa209456', '019eb79a-ba4f-72bc-aec8-bc69ba6f0a27', '1983-02-03', 'Marty Bank', '019eb79a-babb-722a-ad06-6714950415aa', '5434914447', NULL, 10221.71, 1, 0, 'Esse aspernatur quia inventore architecto debitis eum et perspiciatis.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0c83-7282-9374-57328eafcb34', NULL, '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '1982-10-06', 'Lebrun Costa SAS Bank', '019eb79a-bad3-7352-a381-13c4f25a97b0', '6818133794', NULL, 10626.57, 0, 1, 'Vel sed ea est.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0cc3-72d1-a2f0-43971ba3330f', NULL, '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '2020-01-17', 'Reynaud Bank', '019eb79a-babb-722a-ad06-6714950415aa', '0141102131', NULL, 29812.38, 1, 0, 'Culpa voluptatum dolor suscipit asperiores nobis quisquam.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0d42-7347-93d3-48d896890de3', NULL, '019eb79a-b8bb-73e6-80e0-db4098843426', '1978-03-10', 'Simon Bourgeois SA Bank', '019eb79a-b5dd-72ae-bbbc-45f155dc57c8', '4204372497', NULL, 38474.17, 0, 1, 'Ullam est eos quisquam dignissimos.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0d8a-73cb-a318-64e839a67d72', NULL, '019eb79a-b517-7033-832f-47fb744ca39e', '2014-12-16', 'Buisson Bank', '019eb79a-b5dd-72ae-bbbc-45f155dc57c8', '9716367730', NULL, 40700.14, 0, 1, 'Natus consequatur in dignissimos aut sint nam.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb79b-0dcb-72a6-9cba-d3e9d3c1f2b9', NULL, '019eb79a-ba00-7344-8abd-0792b682a822', '1988-03-19', 'Mace Bank', '019eb79a-b68b-733b-847d-5dc5e3494ee9', '0787415963', NULL, 3040.63, 0, 0, 'Inventore consequuntur laborum laboriosam fugit exercitationem quia.', '2026-06-11 16:54:12', '2026-06-11 16:54:12'),
('019eb841-2c3e-7308-8bf3-37e347187c9c', '019eb79a-b213-72b6-b67f-280713f83ae3', '019eb79a-ba00-7344-8abd-0792b682a822', '2026-06-18', 'BMCE Bank of Africa', '019eb79a-b5f6-70aa-ab23-a7aa14e189a5', 'dsdf', NULL, 25.00, 0, 1, NULL, '2026-06-11 19:55:39', '2026-06-11 19:55:43'),
('019eb84f-dbb7-7344-9ea8-e3240217af05', '019eb79a-b213-72b6-b67f-280713f83ae3', '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '2026-06-12', 'BMCE Bank of Africa', '019eb79a-b5f6-70aa-ab23-a7aa14e189a5', 'gh', NULL, 34.00, 1, 0, NULL, '2026-06-11 20:11:41', '2026-06-11 20:13:05'),
('019eb851-9f04-730f-8f55-b83648d5d956', '019eb79a-b213-72b6-b67f-280713f83ae3', '019eb79a-ba36-7133-be3e-3d7d2f7f3c52', '2026-06-20', 'BMCI', '019eb79a-b639-7177-8278-a7d4ff117184', 'ftf', NULL, 456.00, 0, 1, NULL, '2026-06-11 20:13:37', '2026-06-11 20:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `representants`
--

DROP TABLE IF EXISTS `representants`;
CREATE TABLE IF NOT EXISTS `representants` (
  `id` char(36) NOT NULL,
  `destination_id` char(36) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `cin` varchar(20) NOT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` text,
  `code_postale` varchar(10) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `lieu_de_travail` varchar(255) DEFAULT NULL,
  `login` varchar(100) NOT NULL,
  `bl_count` int UNSIGNED NOT NULL DEFAULT '0',
  `remb_count` int UNSIGNED NOT NULL DEFAULT '0',
  `last_online_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `representants_cin_unique` (`cin`),
  UNIQUE KEY `representants_login_unique` (`login`),
  UNIQUE KEY `representants_email_unique` (`email`),
  KEY `representants_destination_id_foreign` (`destination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `representants`
--

INSERT INTO `representants` (`id`, `destination_id`, `nom`, `cin`, `tel`, `email`, `adresse`, `code_postale`, `ville`, `lieu_de_travail`, `login`, `bl_count`, `remb_count`, `last_online_at`, `created_at`, `updated_at`) VALUES
('019eb79a-bf4f-714e-84d0-5e7d1b8007d3', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Margot de la Diallo', 'pn525363', '0330773084', 'briviere@example.com', 'chemin Élodie Le Roux\n50545 Deschamps-sur-Mer', '22289', 'Martineau-la-Forêt', 'Guillot S.A.S.', 'jregnier', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b413-7217-92e8-ad64149a5838', 'Stéphane Delmas', 'io622466', '+33 8 24 15 89 86', 'laure31@example.org', '47, impasse de Moreno\n69678 Lelievre', '26546', 'Guillaume-sur-Mer', 'Perrin', 'xdavid', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Danielle Carlier', 'ok109948', '09 33 30 66 42', 'hbarthelemy@example.net', '67, place Aurélie Leroux\n38767 Gomez', '10020', 'Leveque', 'Payet', 'andree94', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bfa0-714e-a2fb-9c4911826581', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Eugène Adam', 'az577442', '+33 (0)1 26 16 59 42', 'fdavid@example.net', '73, boulevard Hardy\n36061 LeducBourg', '07513', 'Regnier', 'Philippe', 'plamy', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79a-b413-7217-92e8-ad64149a5838', 'Andrée du Pottier', 'to379152', '+33 9 07 43 39 83', 'valexandre@example.net', '4, chemin Laetitia Guillet\n92622 Legros', '10858', 'Menard-sur-Lelievre', 'Da Silva', 'honore.henry', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b413-7217-92e8-ad64149a5838', 'Pauline Guichard', 'ws863463', '01 34 25 42 80', 'timothee.delannoy@example.org', '83, rue de Gaudin\n32681 Pereira-sur-Auger', '00933', 'BlanchardBourg', 'Martinez Dupuy et Fils', 'gabriel30', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'Élodie Renaud', 'rs335029', '09 05 75 35 97', 'philippine40@example.net', '28, rue Bodin\n66485 Chevalier-sur-Barre', '89490', 'Delaunayboeuf', 'Lopes SAS', 'frousseau', 0, 0, NULL, '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb8c2-8d5d-7032-bd7d-188f3a01ed1c', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', 'mouad', 'SF145852', 'dfg', 'dfg@hgj.jh', 'dsf', 'dsf', 'dsf', 'dsf', 'Mouad', 0, 0, NULL, '2026-06-11 22:16:58', '2026-06-11 22:27:22');

-- --------------------------------------------------------

--
-- Table structure for table `rep_remboursements`
--

DROP TABLE IF EXISTS `rep_remboursements`;
CREATE TABLE IF NOT EXISTS `rep_remboursements` (
  `id` char(36) NOT NULL,
  `season_id` char(36) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `fact_id` char(36) DEFAULT NULL,
  `date_payment` date NOT NULL,
  `banque_id` char(36) DEFAULT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `cheque_image_path` varchar(255) DEFAULT NULL,
  `type_versement` varchar(255) NOT NULL DEFAULT 'Versement',
  `compte` varchar(255) DEFAULT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date_prevue` date DEFAULT NULL,
  `date_versement` date DEFAULT NULL,
  `statut_recu` tinyint(1) NOT NULL DEFAULT '0',
  `statut_rejete` tinyint(1) NOT NULL DEFAULT '0',
  `statut_accepte` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rep_remboursements_season_id_foreign` (`season_id`),
  KEY `rep_remboursements_banque_id_foreign` (`banque_id`),
  KEY `rep_remboursements_rep_id_index` (`rep_id`),
  KEY `rep_remboursements_fact_id_index` (`fact_id`),
  KEY `rep_remboursements_date_payment_index` (`date_payment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rep_remboursements`
--

INSERT INTO `rep_remboursements` (`id`, `season_id`, `entity_type`, `rep_id`, `fact_id`, `date_payment`, `banque_id`, `cheque_number`, `cheque_image_path`, `type_versement`, `compte`, `montant`, `date_prevue`, `date_versement`, `statut_recu`, `statut_rejete`, `statut_accepte`, `remarks`, `created_at`, `updated_at`) VALUES
('019eb79b-10db-7373-9d6a-deece0f731d3', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79b-0ff4-70be-9779-7978581d656e', '2023-07-07', '019eb79a-b6a3-7217-913e-0da245144344', '3663243617', NULL, 'Versement', 'gh', 1975.65, '1997-10-12', '2026-06-11', 0, 1, 1, 'Natus corrupti rerum quos.', '2026-06-11 16:54:13', '2026-06-11 22:39:11'),
('019eb79b-110c-7383-a781-5ab3c5265c3a', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79b-100a-70e0-b592-6d68ef405565', '1993-10-27', '019eb79a-bb05-70b9-af50-f50af9a71647', '3283317972', NULL, 'Virement', NULL, 8735.34, '2010-07-13', '1998-02-26', 0, 1, 0, 'Ut aut quam eos.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-111f-728b-b62c-a01c0d187415', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, NULL, '019eb79b-101d-70dd-b17d-f51d4319eb1f', '2004-05-28', '019eb79a-baa2-7347-927b-eb4f0bafb765', '1807321757', NULL, 'Virement', NULL, 1385.41, '2003-12-18', '2022-06-15', 1, 1, 0, 'Ullam et illum qui id quisquam.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1148-7060-889b-83e6e54559af', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79b-0fc1-73b0-a8ba-881ea14e8493', '2014-02-05', '019eb79a-b5c0-715b-bbcb-e1bca5a93860', '3586461616', NULL, 'Virement', NULL, 6621.74, '1986-10-11', '1975-10-29', 1, 0, 1, 'Odio est tempora autem qui aut aut.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-115f-7004-bc4e-1372f1dc36c6', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79b-1034-72d1-8232-5a340e092bdf', '1988-10-31', '019eb79a-b659-708b-b2be-21b37409e8ec', '5897432725', NULL, 'En main propre', NULL, 1515.29, '1989-11-20', '1986-02-21', 0, 0, 0, 'Amet eos enim et mollitia dicta non.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-117a-738a-8f74-bdfcfe4c8c05', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bfba-7039-9176-f49bbdddb678', '019eb79b-0fc1-73b0-a8ba-881ea14e8493', '2010-07-29', '019eb79a-b5dd-72ae-bbbc-45f155dc57c8', '9124686308', NULL, 'Versement', NULL, 1101.53, '2019-12-17', '1982-12-20', 0, 0, 0, 'Quis qui ab qui deleniti quisquam odit molestiae.', '2026-06-11 16:54:13', '2026-06-11 16:54:13'),
('019eb79b-1191-70a4-a25a-5454442e556b', '019eb79a-b213-72b6-b67f-280713f83ae3', NULL, '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79b-0ff4-70be-9779-7978581d656e', '1997-03-09', '019eb79a-baed-7276-82b8-7597cb787c46', '0973762363', NULL, 'Virement', NULL, 4441.99, '1988-05-18', '2001-04-16', 0, 0, 0, 'Nostrum nobis sunt et cum voluptatem pariatur.', '2026-06-11 16:54:13', '2026-06-11 16:54:13');

-- --------------------------------------------------------

--
-- Table structure for table `robots`
--

DROP TABLE IF EXISTS `robots`;
CREATE TABLE IF NOT EXISTS `robots` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) DEFAULT NULL,
  `destination_id` char(36) DEFAULT NULL,
  `date_operation` date NOT NULL,
  `ville` varchar(100) NOT NULL,
  `etablissement` text NOT NULL,
  `contact_nom` varchar(150) NOT NULL,
  `contact_tel` varchar(50) NOT NULL,
  `reference_robot` varchar(100) NOT NULL,
  `quantite_vue` int NOT NULL DEFAULT '0',
  `quantite_recue` int NOT NULL DEFAULT '0',
  `images` json DEFAULT NULL,
  `statut` enum('Placé','En Démonstration','Retourné','Vendu') NOT NULL DEFAULT 'Placé',
  `remarques` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `robots_destination_id_foreign` (`destination_id`),
  KEY `robots_rep_id_index` (`rep_id`),
  KEY `robots_statut_index` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `robots`
--

INSERT INTO `robots` (`id`, `rep_id`, `destination_id`, `date_operation`, `ville`, `etablissement`, `contact_nom`, `contact_tel`, `reference_robot`, `quantite_vue`, `quantite_recue`, `images`, `statut`, `remarques`, `created_at`, `updated_at`) VALUES
('019eb79a-d776-732d-bfc1-f8f3d3520f9f', '019eb79a-bfd2-7374-9833-fbbc0f2c6b4b', '019eb79a-b413-7217-92e8-ad64149a5838', '1975-07-14', 'Humbert', 'Salmon S.A.', 'Jacques Charles', '01 75 02 26 38', 'ROBOT-0365', 5, 8, '[]', 'En Démonstration', 'Dolor et corrupti eos laudantium.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d793-7014-b4b9-d9efb3bb7bbc', '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b413-7217-92e8-ad64149a5838', '2008-08-26', 'Fischer-la-Forêt', 'Marin', 'Emmanuelle Bourgeois', '+33 (0)8 10 46 69 25', 'ROBOT-9762', 9, 7, '[]', 'Placé', 'Autem et accusantium ut iste saepe.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d7c6-72c3-a942-a9272aa96a1a', '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b413-7217-92e8-ad64149a5838', '2003-11-17', 'Remy', 'Marchal Antoine et Fils', 'Louis Mallet-Coste', '+33 4 96 35 19 06', 'ROBOT-0006', 1, 6, '[]', 'Vendu', 'Aut quisquam vel ipsam esse occaecati expedita sapiente.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d7e1-71e6-a6d0-e77788ba58bc', '019eb79a-bf6e-7324-ab86-0be7f09aaf54', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', '1991-05-30', 'Ferreiradan', 'Boucher SARL', 'Maggie Jourdan-Didier', '+33 6 98 88 06 19', 'ROBOT-6979', 1, 1, '[]', 'Retourné', 'Officia quis ut dicta eius qui.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d800-712c-be37-c46d8b12ecd6', '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', '2009-09-18', 'Salmonnec', 'Muller Clement SAS', 'Julien de Dumont', '09 52 44 11 02', 'ROBOT-4856', 4, 1, '[]', 'Vendu', 'Voluptas debitis aut et modi.', '2026-06-11 16:53:58', '2026-06-11 16:53:58'),
('019eb79a-d86c-709f-8f6b-3fde9db9a388', '019eb79a-bfec-7203-9594-987e27b8f474', '019eb79a-b3f3-7241-a607-104dfaf0f3f5', '2016-02-22', 'Fontaineboeuf', 'Toussaint', 'Capucine Lemaire', '+33 1 10 32 55 65', 'ROBOT-6491', 5, 4, '[]', 'Placé', 'Eveniet et autem autem id maxime.', '2026-06-11 16:53:59', '2026-06-11 16:53:59'),
('019eb79a-d8b7-7086-a4c2-f30ab8eafe2e', '019eb79a-bf88-70cc-a6da-67b035f5b3fa', '019eb79a-b413-7217-92e8-ad64149a5838', '2017-03-24', 'Francois', 'Hardy', 'Éric Laporte', '0812430129', 'ROBOT-6127', 10, 7, '[]', 'En Démonstration', 'Sint eos vel accusantium ad sunt labore natus.', '2026-06-11 16:53:59', '2026-06-11 16:53:59');

-- --------------------------------------------------------

--
-- Table structure for table `seasons`
--

DROP TABLE IF EXISTS `seasons`;
CREATE TABLE IF NOT EXISTS `seasons` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `start_year` varchar(4) NOT NULL,
  `end_date` date NOT NULL,
  `end_year` varchar(4) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seasons_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `seasons`
--

INSERT INTO `seasons` (`id`, `name`, `start_date`, `start_year`, `end_date`, `end_year`, `is_active`, `created_at`, `updated_at`) VALUES
('019eb79a-b0fd-71c5-8946-c209b28ed84c', '2324', '2023-09-01', '2023', '2024-08-31', '2024', 0, '2026-06-11 16:53:48', '2026-06-11 16:53:48'),
('019eb79a-b172-7140-b5b4-6b702b54e43a', '2425', '2024-09-01', '2024', '2025-08-31', '2025', 0, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b1b0-735f-96f7-94287d66df2e', '2526', '2025-09-01', '2025', '2026-08-31', '2026', 0, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b213-72b6-b67f-280713f83ae3', '2627', '2026-09-01', '2026', '2027-08-31', '2027', 1, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b233-72b3-ad04-0d6ac33fb443', '2728', '2027-09-01', '2027', '2028-08-31', '2028', 0, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b253-7118-a974-b8b1d3464321', '2829', '2028-09-01', '2028', '2029-08-31', '2029', 0, '2026-06-11 16:53:49', '2026-06-11 16:53:49'),
('019eb79a-b26d-71dc-bfeb-2394fa209456', '2930', '2029-09-01', '2029', '2030-08-31', '2030', 0, '2026-06-11 16:53:49', '2026-06-11 16:53:49');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `payload` longtext NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text,
  `type` varchar(255) NOT NULL DEFAULT 'string',
  `description` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
('019eb79a-bd56-719d-870c-b1d1d117ce7b', 'Édith Garnier', 'josephine.berger@example.com', '2026-06-11 16:53:51', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'wY5HnzNCQe', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bd8d-723f-a3e2-e06c1cfe0c44', 'Léon Lemaire', 'eugene.legrand@example.com', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'mNEtqqZDUZ', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bda6-7190-bdc1-ab1b521e88ac', 'Arthur Perrot', 'victor68@example.org', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'u77vJFLz40', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bdbf-71b5-8daf-f97b83130eb3', 'Catherine Grondin', 'lenoir.louis@example.net', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'tDr06ra0LB', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bde0-72b8-85e3-9ad25dcaa583', 'Anouk Daniel', 'monique.blot@example.net', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'mE9VfQeK6O', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-bdf9-7051-a17b-3dd13e1fc594', 'Philippine Remy', 'josette.boutin@example.org', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'pRqlKrEfU0', '2026-06-11 16:53:52', '2026-06-11 16:53:52'),
('019eb79a-be11-70f8-9498-91074913128e', 'Pauline Leblanc-Bertin', 'wbenoit@example.org', '2026-06-11 16:53:52', '$2y$12$IA2utTYf9duyF3RZQb1bhuRm179xony/BbKABoQGYhKFt5am.v9DG', 'LVvI1YlA87', '2026-06-11 16:53:52', '2026-06-11 16:53:52');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `b_livraisons`
--
ALTER TABLE `b_livraisons`
  ADD CONSTRAINT `b_livraisons_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `b_livraisons_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `b_livraison_imps`
--
ALTER TABLE `b_livraison_imps`
  ADD CONSTRAINT `b_livraison_imps_imprimeur_id_foreign` FOREIGN KEY (`imprimeur_id`) REFERENCES `imprimeurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `b_livraison_imps_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `b_livraison_items`
--
ALTER TABLE `b_livraison_items`
  ADD CONSTRAINT `b_livraison_items_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `b_livraison_items_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `b_ventes_clients`
--
ALTER TABLE `b_ventes_clients`
  ADD CONSTRAINT `b_ventes_clients_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `b_ventes_clients_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `b_ventes_clients_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `b_ventes_clients_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cahier_communication`
--
ALTER TABLE `cahier_communication`
  ADD CONSTRAINT `cahier_communication_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `cahier_communication_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carte_visites`
--
ALTER TABLE `carte_visites`
  ADD CONSTRAINT `carte_visites_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `carte_visites_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `catalogues`
--
ALTER TABLE `catalogues`
  ADD CONSTRAINT `catalogues_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_destination_id_foreign` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `clients_representant_id_foreign` FOREIGN KEY (`representant_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `client_remboursements`
--
ALTER TABLE `client_remboursements`
  ADD CONSTRAINT `client_remboursements_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `client_remboursements_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `client_remboursements_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `client_remboursements_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `demande_f`
--
ALTER TABLE `demande_f`
  ADD CONSTRAINT `demande_f_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demande_f_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demande_f_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `depots`
--
ALTER TABLE `depots`
  ADD CONSTRAINT `depots_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `depots_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `depots_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `det_fact`
--
ALTER TABLE `det_fact`
  ADD CONSTRAINT `det_fact_fact_id_foreign` FOREIGN KEY (`fact_id`) REFERENCES `fact` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `det_fact_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `det_fact_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fact`
--
ALTER TABLE `fact`
  ADD CONSTRAINT `fact_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demande_f` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fact_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fact_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fact_sequence_id_foreign` FOREIGN KEY (`sequence_id`) REFERENCES `fact_sequences` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `livres`
--
ALTER TABLE `livres`
  ADD CONSTRAINT `livres_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `remb_imp`
--
ALTER TABLE `remb_imp`
  ADD CONSTRAINT `remb_imp_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `remb_imp_imprimeur_id_foreign` FOREIGN KEY (`imprimeur_id`) REFERENCES `imprimeurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `remb_imp_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `representants`
--
ALTER TABLE `representants`
  ADD CONSTRAINT `representants_destination_id_foreign` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rep_remboursements`
--
ALTER TABLE `rep_remboursements`
  ADD CONSTRAINT `rep_remboursements_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rep_remboursements_fact_id_foreign` FOREIGN KEY (`fact_id`) REFERENCES `fact` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rep_remboursements_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rep_remboursements_season_id_foreign` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `robots`
--
ALTER TABLE `robots`
  ADD CONSTRAINT `robots_destination_id_foreign` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `robots_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
