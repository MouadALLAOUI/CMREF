-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 09, 2026 at 08:14 PM
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
-- Database: `ajialmedias_gestion_app_dev`
--
CREATE DATABASE IF NOT EXISTS `ajialmedias_gestion_app_dev` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `ajialmedias_gestion_app_dev`;

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

-- --------------------------------------------------------

--
-- Table structure for table `b_livraisons`
--

DROP TABLE IF EXISTS `b_livraisons`;
CREATE TABLE IF NOT EXISTS `b_livraisons` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `bl_number` varchar(50) NOT NULL,
  `date_emission` date NOT NULL,
  `mode_envoi` text,
  `type` enum('Livre','Specimen','Pedagogie','Retour') NOT NULL DEFAULT 'Livre',
  `statut_recu` tinyint(1) NOT NULL DEFAULT '0',
  `statut_vu` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('Pending','Seen','Received') DEFAULT 'Pending',
  `annee` text,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_livraisons_rep_id_foreign` (`rep_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `b_livraison_imps`
--

DROP TABLE IF EXISTS `b_livraison_imps`;
CREATE TABLE IF NOT EXISTS `b_livraison_imps` (
  `id` char(36) NOT NULL,
  `imprimeur_id` char(36) NOT NULL,
  `date_reception` date NOT NULL,
  `b_livraison_number` varchar(50) NOT NULL,
  `livre_id` char(36) NOT NULL,
  `quantite` int NOT NULL DEFAULT '0',
  `remarks` text,
  `annee` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_livraison_imps_imprimeur_id_foreign` (`imprimeur_id`),
  KEY `b_livraison_imps_livre_id_foreign` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `b_livraison_items`
--

DROP TABLE IF EXISTS `b_livraison_items`;
CREATE TABLE IF NOT EXISTS `b_livraison_items` (
  `id` char(36) NOT NULL,
  `deliverable_id_type` varchar(255) NOT NULL,
  `deliverable_id_id` char(36) NOT NULL,
  `livre_id` char(36) NOT NULL,
  `quantite` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_livraison_items_deliverable_id_type_deliverable_id_id_index` (`deliverable_id_type`,`deliverable_id_id`),
  KEY `b_livraison_items_livre_id_foreign` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `b_ventes_clients`
--

DROP TABLE IF EXISTS `b_ventes_clients`;
CREATE TABLE IF NOT EXISTS `b_ventes_clients` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `b_vente_number` varchar(50) NOT NULL,
  `date_vente` date NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `livre_id` char(36) NOT NULL,
  `quantite` int NOT NULL DEFAULT '0',
  `remise` decimal(5,2) NOT NULL DEFAULT '0.00',
  `annee` varchar(50) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `b_ventes_clients_rep_id_foreign` (`rep_id`),
  KEY `b_ventes_clients_client_id_foreign` (`client_id`),
  KEY `b_ventes_clients_livre_id_foreign` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `rep_id` char(36) NOT NULL,
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
  `annee_scolaire` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cahier_communication_rep_id_foreign` (`rep_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carte_visites`
--

DROP TABLE IF EXISTS `carte_visites`;
CREATE TABLE IF NOT EXISTS `carte_visites` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
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
  `annee_scolaire` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carte_visites_rep_id_foreign` (`rep_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catalogues`
--

DROP TABLE IF EXISTS `catalogues`;
CREATE TABLE IF NOT EXISTS `catalogues` (
  `id` char(36) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `categorie_id` char(36) NOT NULL,
  `image_url` text,
  `content` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catalogues_categorie_id_foreign` (`categorie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` char(36) NOT NULL,
  `representant_id` char(36) NOT NULL,
  `raison_sociale` varchar(255) NOT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `adresse` text,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clients_representant_id_foreign` (`representant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client_remboursements`
--

DROP TABLE IF EXISTS `client_remboursements`;
CREATE TABLE IF NOT EXISTS `client_remboursements` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
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
  KEY `client_remboursements_rep_id_foreign` (`rep_id`),
  KEY `client_remboursements_client_id_foreign` (`client_id`),
  KEY `client_remboursements_banque_id_foreign` (`banque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `demande_f`
--

DROP TABLE IF EXISTS `demande_f`;
CREATE TABLE IF NOT EXISTS `demande_f` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `date_demande` date NOT NULL,
  `objet` varchar(255) DEFAULT NULL,
  `contenu` text,
  `statut` enum('En attente','Approuvée','Rejetée','Facturée') NOT NULL DEFAULT 'En attente',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `demande_f_rep_id_foreign` (`rep_id`),
  KEY `demande_f_client_id_foreign` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `depots`
--

DROP TABLE IF EXISTS `depots`;
CREATE TABLE IF NOT EXISTS `depots` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `livre_id` char(36) NOT NULL,
  `quantite_balance` int NOT NULL DEFAULT '0',
  `status` enum('Actif','Cloturé') NOT NULL DEFAULT 'Actif',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `depots_rep_id_livre_id_unique` (`rep_id`,`livre_id`),
  KEY `depots_livre_id_foreign` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `destination` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `det_fact`
--

DROP TABLE IF EXISTS `det_fact`;
CREATE TABLE IF NOT EXISTS `det_fact` (
  `id` char(36) NOT NULL,
  `fact_id` char(36) NOT NULL,
  `livre_id` char(36) NOT NULL,
  `quantite` int NOT NULL DEFAULT '1',
  `prix_unitaire_ht` decimal(15,2) NOT NULL,
  `remise` decimal(5,2) NOT NULL DEFAULT '0.00',
  `total_ligne_ht` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `det_fact_fact_id_foreign` (`fact_id`),
  KEY `det_fact_livre_id_foreign` (`livre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fact`
--

DROP TABLE IF EXISTS `fact`;
CREATE TABLE IF NOT EXISTS `fact` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `sequence_id` char(36) NOT NULL,
  `year_session` varchar(9) NOT NULL DEFAULT '2026-2027',
  `number` int NOT NULL,
  `fact_number` varchar(50) DEFAULT NULL,
  `date_facture` date NOT NULL,
  `total_ht` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tva_rate` decimal(5,2) NOT NULL DEFAULT '20.00',
  `total_ttc` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('Brouillon','Validée','Payée','Annulée') NOT NULL DEFAULT 'Brouillon',
  `remarques` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fact_year_session_number_unique` (`year_session`,`number`),
  UNIQUE KEY `fact_fact_number_unique` (`fact_number`),
  KEY `fact_rep_id_foreign` (`rep_id`),
  KEY `fact_sequence_id_foreign` (`sequence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `categorie_id` char(36) NOT NULL,
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
  KEY `livres_categorie_id_foreign` (`categorie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `last_visit` date NOT NULL DEFAULT (curdate()),
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `logins_username_unique` (`username`),
  KEY `logins_authenticatable_id_authenticatable_type_index` (`authenticatable_id`,`authenticatable_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `remb_imp`
--

DROP TABLE IF EXISTS `remb_imp`;
CREATE TABLE IF NOT EXISTS `remb_imp` (
  `id` char(36) NOT NULL,
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
  KEY `remb_imp_imprimeur_id_foreign` (`imprimeur_id`),
  KEY `remb_imp_banque_id_foreign` (`banque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `representants`
--

DROP TABLE IF EXISTS `representants`;
CREATE TABLE IF NOT EXISTS `representants` (
  `id` char(36) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `cin` varchar(20) NOT NULL,
  `zone` varchar(255) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` text,
  `code_postale` varchar(10) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `lieu_de_travail` varchar(255) DEFAULT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bl_count` int UNSIGNED NOT NULL DEFAULT '0',
  `remb_count` int UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `representants_cin_unique` (`cin`),
  UNIQUE KEY `representants_login_unique` (`login`),
  UNIQUE KEY `representants_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rep_remboursements`
--

DROP TABLE IF EXISTS `rep_remboursements`;
CREATE TABLE IF NOT EXISTS `rep_remboursements` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
  `date_payment` date NOT NULL,
  `banque_nom` varchar(100) DEFAULT NULL,
  `banque_id` char(36) DEFAULT NULL,
  `cheque_number` varchar(50) DEFAULT NULL,
  `cheque_image_path` varchar(255) DEFAULT NULL,
  `type_versement` enum('En main propre','Virement','Versement') NOT NULL DEFAULT 'Versement',
  `montant` decimal(15,2) NOT NULL,
  `date_prevue` date DEFAULT NULL,
  `statut_recu` tinyint(1) NOT NULL DEFAULT '0',
  `statut_rejete` tinyint(1) NOT NULL DEFAULT '0',
  `statut_accepte` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rep_remboursements_rep_id_foreign` (`rep_id`),
  KEY `rep_remboursements_banque_id_foreign` (`banque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `robots`
--

DROP TABLE IF EXISTS `robots`;
CREATE TABLE IF NOT EXISTS `robots` (
  `id` char(36) NOT NULL,
  `rep_id` char(36) NOT NULL,
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
  KEY `robots_rep_id_foreign` (`rep_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Constraints for dumped tables
--

--
-- Constraints for table `b_livraisons`
--
ALTER TABLE `b_livraisons`
  ADD CONSTRAINT `b_livraisons_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `b_livraison_imps`
--
ALTER TABLE `b_livraison_imps`
  ADD CONSTRAINT `b_livraison_imps_imprimeur_id_foreign` FOREIGN KEY (`imprimeur_id`) REFERENCES `imprimeurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `b_livraison_imps_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `b_livraison_items`
--
ALTER TABLE `b_livraison_items`
  ADD CONSTRAINT `b_livraison_items_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `b_ventes_clients`
--
ALTER TABLE `b_ventes_clients`
  ADD CONSTRAINT `b_ventes_clients_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `b_ventes_clients_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `b_ventes_clients_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cahier_communication`
--
ALTER TABLE `cahier_communication`
  ADD CONSTRAINT `cahier_communication_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carte_visites`
--
ALTER TABLE `carte_visites`
  ADD CONSTRAINT `carte_visites_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `catalogues`
--
ALTER TABLE `catalogues`
  ADD CONSTRAINT `catalogues_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_representant_id_foreign` FOREIGN KEY (`representant_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_remboursements`
--
ALTER TABLE `client_remboursements`
  ADD CONSTRAINT `client_remboursements_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `client_remboursements_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `client_remboursements_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `demande_f`
--
ALTER TABLE `demande_f`
  ADD CONSTRAINT `demande_f_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demande_f_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `depots`
--
ALTER TABLE `depots`
  ADD CONSTRAINT `depots_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `depots_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `det_fact`
--
ALTER TABLE `det_fact`
  ADD CONSTRAINT `det_fact_fact_id_foreign` FOREIGN KEY (`fact_id`) REFERENCES `fact` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `det_fact_livre_id_foreign` FOREIGN KEY (`livre_id`) REFERENCES `livres` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `fact`
--
ALTER TABLE `fact`
  ADD CONSTRAINT `fact_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fact_sequence_id_foreign` FOREIGN KEY (`sequence_id`) REFERENCES `fact_sequences` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `livres`
--
ALTER TABLE `livres`
  ADD CONSTRAINT `livres_categorie_id_foreign` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `remb_imp`
--
ALTER TABLE `remb_imp`
  ADD CONSTRAINT `remb_imp_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `remb_imp_imprimeur_id_foreign` FOREIGN KEY (`imprimeur_id`) REFERENCES `imprimeurs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rep_remboursements`
--
ALTER TABLE `rep_remboursements`
  ADD CONSTRAINT `rep_remboursements_banque_id_foreign` FOREIGN KEY (`banque_id`) REFERENCES `banques` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rep_remboursements_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `robots`
--
ALTER TABLE `robots`
  ADD CONSTRAINT `robots_rep_id_foreign` FOREIGN KEY (`rep_id`) REFERENCES `representants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
