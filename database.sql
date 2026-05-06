-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 16 jan. 2026 à 10:39
-- Version du serveur : 5.7.44
-- Version de PHP : 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ajialmedias_gestion_app_dev`
--

CREATE DATABASE IF NOT EXISTS `ajialmedias_gestion_app_dev`;
USE `ajialmedias_gestion_app_dev`;


-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `login` text NOT NULL,
  `pass` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `login`, `pass`) VALUES
(1, 'admin', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `bl`
--

CREATE TABLE `bl` (
  `id` int(11) NOT NULL,
  `rep` text NOT NULL,
  `bl` text NOT NULL,
  `date` text NOT NULL,
  `type` text NOT NULL,
  `mode` text NOT NULL,
  `titre` text NOT NULL,
  `qte` int(11) NOT NULL,
  `etat` int(11) NOT NULL,
  `vue` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `bl`
--

INSERT INTO `bl` (`id`, `rep`, `bl`, `date`, `type`, `mode`, `titre`, `qte`, `etat`, `vue`, `ann`) VALUES
(1, '1', '0001-2026', '2026-01-12', 'BL', '---', '1', 20, 1, 1, '26/27'),
(2, '1', '0001-2026', '2026-01-12', 'BL', '---', '2', 20, 1, 1, '26/27'),
(3, '1', '0001-2026', '2026-01-12', 'BL', '---', '3', 20, 1, 1, '26/27'),
(4, '1', '0001-2026', '2026-01-12', 'BL', '---', '4', 20, 1, 1, '26/27'),
(5, '1', '0001-2026', '2026-01-12', 'BL', '---', '5', 20, 1, 1, '26/27'),
(6, '1', '0001-2026', '2026-01-12', 'BL', '---', '6', 20, 1, 1, '26/27'),
(7, '1', '0001-2026', '2026-01-12', 'BL', '---', '7', 50, 1, 1, '26/27'),
(8, '1', '0001-2026', '2026-01-12', 'BL', '---', '8', 50, 1, 1, '26/27'),
(9, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '1', 5, 1, 1, '26/27'),
(10, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '2', 5, 1, 1, '26/27'),
(11, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '3', 5, 1, 1, '26/27'),
(12, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '4', 5, 1, 1, '26/27'),
(13, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '5', 5, 1, 1, '26/27'),
(14, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '6', 5, 1, 1, '26/27'),
(15, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '7', 5, 1, 1, '26/27'),
(16, '1', 'Spé 01-2026', '2026-01-12', 'Specimen', '---', '8', 5, 1, 1, '26/27'),
(17, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '1', -10, 1, 1, '26/27'),
(18, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '2', -10, 1, 1, '26/27'),
(19, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '3', -10, 1, 1, '26/27'),
(20, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '4', -10, 1, 1, '26/27'),
(21, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '5', -10, 1, 1, '26/27'),
(22, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '6', -10, 1, 1, '26/27'),
(23, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '7', -10, 1, 1, '26/27'),
(24, '1', 'Ret 01-2026', '2026-01-12', 'Retour', '---', '8', -10, 1, 1, '26/27'),
(25, '1', '002-2026', '2026-01-12', 'BL', '---', '7', 20, 1, 1, '26/27'),
(26, '1', '002-2026', '2026-01-12', 'BL', '---', '8', 20, 1, 1, '26/27'),
(27, '1', '003-2026', '2026-01-09', 'Pedagogie', '---', '9', 10, 1, 1, '26/27'),
(28, '1', '003-2026', '2026-01-09', 'Pedagogie', '---', '10', 10, 1, 1, '26/27'),
(29, '1', '004-2026', '2026-01-06', 'BL', '---', '1', 100, 1, 1, ''),
(30, '1', '004-2026', '2026-01-06', 'BL', '---', '2', 100, 1, 1, ''),
(31, '1', '004-2026', '2026-01-06', 'BL', '---', '3', 100, 1, 1, ''),
(32, '1', '004-2026', '2026-01-06', 'BL', '---', '4', 100, 1, 1, ''),
(33, '1', '004-2026', '2026-01-06', 'BL', '---', '5', 100, 1, 1, ''),
(34, '1', '004-2026', '2026-01-06', 'BL', '---', '6', 100, 1, 1, ''),
(35, '1', '004-2026', '2026-01-06', 'BL', '---', '1', 100, 1, 1, '26/27'),
(36, '1', '004-2026', '2026-01-06', 'BL', '---', '2', 100, 1, 1, '26/27'),
(37, '1', '004-2026', '2026-01-06', 'BL', '---', '3', 100, 1, 1, '26/27'),
(38, '1', '004-2026', '2026-01-06', 'BL', '---', '4', 100, 1, 1, '26/27'),
(39, '1', '004-2026', '2026-01-06', 'BL', '---', '5', 100, 1, 1, '26/27'),
(40, '1', '004-2026', '2026-01-06', 'BL', '---', '6', 100, 1, 1, '26/27'),
(41, '1', '005-2026', '2026-01-08', 'BL', '---', '9', 30, 1, 1, '26/27'),
(42, '1', '005-2026', '2026-01-08', 'BL', '---', '10', 30, 1, 1, '26/27'),
(43, '2', '006-2026', '2026-01-02', 'BL', '---', '1', 10, 0, 0, '26/27'),
(44, '2', '006-2026', '2026-01-02', 'BL', '---', '2', 10, 0, 0, '26/27'),
(45, '2', '006-2026', '2026-01-02', 'BL', '---', '3', 10, 0, 0, '26/27'),
(46, '2', '006-2026', '2026-01-02', 'BL', '---', '4', 10, 0, 0, '26/27'),
(47, '2', '006-2026', '2026-01-02', 'BL', '---', '5', 10, 0, 0, '26/27'),
(48, '2', '006-2026', '2026-01-02', 'BL', '---', '6', 10, 0, 0, '26/27'),
(49, '2', '007-2026', '2026-01-05', 'BL', '---', '7', 10, 0, 0, '26/27'),
(50, '2', '007-2026', '2026-01-05', 'BL', '---', '8', 10, 0, 0, '26/27'),
(51, '2', '008-2026', '2026-01-06', 'BL', '---', '1', 20, 0, 0, '26/27'),
(52, '2', '008-2026', '2026-01-06', 'BL', '---', '2', 20, 0, 0, '26/27'),
(53, '2', '008-2026', '2026-01-06', 'BL', '---', '3', 20, 0, 0, '26/27'),
(54, '2', '008-2026', '2026-01-06', 'BL', '---', '4', 20, 0, 0, '26/27'),
(55, '2', '008-2026', '2026-01-06', 'BL', '---', '5', 20, 0, 0, '26/27'),
(56, '2', '008-2026', '2026-01-06', 'BL', '---', '6', 20, 0, 0, '26/27'),
(57, '2', '008-2026', '2026-01-06', 'BL', '---', '7', 20, 0, 0, '26/27'),
(58, '2', '008-2026', '2026-01-06', 'BL', '---', '8', 20, 0, 0, '26/27'),
(59, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '1', 5, 0, 0, '26/27'),
(60, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '2', 5, 0, 0, '26/27'),
(61, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '3', 5, 0, 0, '26/27'),
(62, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '4', 5, 0, 0, '26/27'),
(63, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '5', 5, 0, 0, '26/27'),
(64, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '6', 5, 0, 0, '26/27'),
(65, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '7', 5, 0, 0, '26/27'),
(66, '2', 'Spé 02-2026', '2026-01-07', 'Specimen', '---', '8', 5, 0, 0, '26/27'),
(67, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '1', -5, 0, 0, '26/27'),
(68, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '2', -5, 0, 0, '26/27'),
(69, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '3', -5, 0, 0, '26/27'),
(70, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '4', -5, 0, 0, '26/27'),
(71, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '5', -5, 0, 0, '26/27'),
(72, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '6', -5, 0, 0, '26/27'),
(73, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '7', -5, 0, 0, '26/27'),
(74, '2', 'Ret 02-2026', '2026-01-07', 'Retour', '---', '8', -5, 0, 0, '26/27'),
(75, '2', 'Péd001-2026', '2026-01-15', 'Pedagogie', '---', '9', 5, 0, 0, '26/27'),
(76, '2', 'Péd001-2026', '2026-01-15', 'Pedagogie', '---', '10', 5, 0, 0, '26/27'),
(77, '2', '009-2026', '2026-01-06', 'BL', '---', '9', 20, 0, 0, '26/27'),
(78, '2', '009-2026', '2026-01-06', 'BL', '---', '10', 20, 0, 0, '26/27');

-- --------------------------------------------------------

--
-- Structure de la table `bl_client`
--

CREATE TABLE `bl_client` (
  `id` int(11) NOT NULL,
  `rep` text NOT NULL,
  `client` int(11) NOT NULL,
  `bl` text NOT NULL,
  `date` text NOT NULL,
  `type` text NOT NULL,
  `titre` text NOT NULL,
  `qte` int(11) NOT NULL,
  `remise` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `bl_imp`
--

CREATE TABLE `bl_imp` (
  `id` int(11) NOT NULL,
  `imp` text NOT NULL,
  `date` date NOT NULL,
  `bl` text NOT NULL,
  `titre` text NOT NULL,
  `qte` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `cahier_de_communication`
--

CREATE TABLE `cahier_de_communication` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `ecole` text CHARACTER SET utf8 NOT NULL,
  `type` text CHARACTER SET utf8 NOT NULL,
  `qte` int(11) NOT NULL,
  `nom_fichier` text NOT NULL,
  `date` text NOT NULL,
  `bon_de_commande` text CHARACTER SET utf8 NOT NULL,
  `indication` text CHARACTER SET utf8 NOT NULL,
  `acc` int(11) NOT NULL,
  `refu` int(11) NOT NULL,
  `model_verso` text CHARACTER SET utf8 NOT NULL,
  `model_recto` text CHARACTER SET utf8 NOT NULL,
  `etat_model` int(11) NOT NULL,
  `date_validate_model` text NOT NULL,
  `remarques` text CHARACTER SET utf8 NOT NULL,
  `etat_bon_commande` int(11) NOT NULL,
  `imprimer` int(11) NOT NULL,
  `livree` int(11) NOT NULL,
  `supprimer` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `carte_visites`
--

CREATE TABLE `carte_visites` (
  `id` int(11) NOT NULL,
  `id_rep` int(11) NOT NULL,
  `model` text CHARACTER SET latin1 NOT NULL,
  `date` text COLLATE utf8_unicode_ci NOT NULL,
  `nom` text COLLATE utf8_unicode_ci NOT NULL,
  `fonction` text COLLATE utf8_unicode_ci NOT NULL,
  `tel` text COLLATE utf8_unicode_ci NOT NULL,
  `email` text COLLATE utf8_unicode_ci NOT NULL,
  `adresse` text COLLATE utf8_unicode_ci NOT NULL,
  `autre` text COLLATE utf8_unicode_ci NOT NULL,
  `logo` text COLLATE utf8_unicode_ci NOT NULL,
  `comment_cv` text COLLATE utf8_unicode_ci NOT NULL,
  `chevalet_ligne_1` text COLLATE utf8_unicode_ci NOT NULL,
  `chevalet_ligne_2` text COLLATE utf8_unicode_ci NOT NULL,
  `chevalet_ligne_3` text COLLATE utf8_unicode_ci NOT NULL,
  `comment_chevalet` text COLLATE utf8_unicode_ci NOT NULL,
  `remarques` text COLLATE utf8_unicode_ci NOT NULL,
  `conception` text COLLATE utf8_unicode_ci NOT NULL,
  `valider` int(11) NOT NULL,
  `conception_chevalet` text COLLATE utf8_unicode_ci NOT NULL,
  `valider_chevalet` int(11) NOT NULL,
  `ann` text CHARACTER SET latin1 NOT NULL,
  `supprimer` int(11) NOT NULL,
  `prodchevalet` int(11) NOT NULL,
  `livraisoncarte` int(11) NOT NULL,
  `prodcarte` int(11) NOT NULL,
  `livraisonchevalet` int(11) NOT NULL,
  `recucarte` int(11) NOT NULL,
  `recuchevalet` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `catalogue`
--

CREATE TABLE `catalogue` (
  `id` int(11) NOT NULL,
  `titre` text CHARACTER SET utf8 NOT NULL,
  `cat` int(11) NOT NULL,
  `image` text CHARACTER SET utf8 NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `libelle` text CHARACTER SET utf8 NOT NULL,
  `descr` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `libelle`, `descr`) VALUES
(1, 'Primaire ', '  '),
(2, 'Collège', ' '),
(3, 'Lycée', ' '),
(4, 'Près-scolaire', ' '),
(5, 'Robotos', ' ');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `ste` text NOT NULL,
  `ville` text NOT NULL,
  `adresse` text NOT NULL,
  `tel` text NOT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `content`
--

CREATE TABLE `content` (
  `id` int(11) NOT NULL,
  `type` text CHARACTER SET utf8 NOT NULL,
  `champ1` text CHARACTER SET utf8 NOT NULL,
  `champ2` text CHARACTER SET utf8 NOT NULL,
  `champ3` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `demande_f`
--

CREATE TABLE `demande_f` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `client` text CHARACTER SET utf8 NOT NULL,
  `date` date NOT NULL,
  `ref` int(11) NOT NULL,
  `type` text NOT NULL,
  `ville` text CHARACTER SET utf8 NOT NULL,
  `ice` varchar(255) NOT NULL,
  `adresse` text CHARACTER SET utf8 NOT NULL,
  `tel` text NOT NULL,
  `etat` int(11) NOT NULL,
  `livree` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `depot`
--

CREATE TABLE `depot` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `titre` int(11) NOT NULL,
  `type` text NOT NULL,
  `qte` int(11) NOT NULL,
  `ann` text NOT NULL,
  `etat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `det_fact`
--

CREATE TABLE `det_fact` (
  `id` int(11) NOT NULL,
  `ref` int(11) NOT NULL,
  `id_livre` int(11) NOT NULL,
  `remise` int(11) NOT NULL,
  `qte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `download`
--

CREATE TABLE `download` (
  `id` int(11) NOT NULL,
  `livre` int(11) NOT NULL,
  `chapitre` text CHARACTER SET utf8 NOT NULL,
  `logo` text CHARACTER SET utf8 NOT NULL,
  `file` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `fact`
--

CREATE TABLE `fact` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `n_fact` text NOT NULL,
  `montant` int(11) NOT NULL,
  `banque1` text NOT NULL,
  `banque2` text NOT NULL,
  `banque3` text NOT NULL,
  `cheque1` text NOT NULL,
  `cheque2` text NOT NULL,
  `cheque3` text NOT NULL,
  `montant1` text NOT NULL,
  `montant2` text NOT NULL,
  `montant3` text NOT NULL,
  `comment` text CHARACTER SET utf8 NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `factures_26_27`
--

CREATE TABLE `factures_26_27` (
  `id` int(11) NOT NULL,
  `num_fact` text NOT NULL,
  `date` int(11) NOT NULL,
  `ref` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `imprimeur`
--

CREATE TABLE `imprimeur` (
  `id` int(11) NOT NULL,
  `ste` text NOT NULL,
  `adresse` text NOT NULL,
  `dir` text NOT NULL,
  `d_tel` text NOT NULL,
  `d_email` text NOT NULL,
  `adjoint` text NOT NULL,
  `j_tel` text NOT NULL,
  `j_email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `imprimeur`
--

INSERT INTO `imprimeur` (`id`, `ste`, `adresse`, `dir`, `d_tel`, `d_email`, `adjoint`, `j_tel`, `j_email`) VALUES
(4, 'watanya', 'marrakech', 'abdellatif', '0661  165 264', 'iwatanya@gmail.com', 'nourdine', 'hhhh@gmail.com', '0610 965 105'),
(5, 'BEST BM', 'MArrakech Massira', 'Abderrahim', 'adnanebaribi@gmail.com', '0668962669', '', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `livre`
--

CREATE TABLE `livre` (
  `id` int(11) NOT NULL,
  `titre` text CHARACTER SET utf8 NOT NULL,
  `code` text NOT NULL,
  `categorie` int(11) NOT NULL,
  `prix_d` float NOT NULL,
  `prix_v` float NOT NULL,
  `prix_pub` float NOT NULL,
  `nb_page` int(11) NOT NULL,
  `color` varchar(6) NOT NULL,
  `descr` text CHARACTER SET utf8 NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `livre`
--

INSERT INTO `livre` (`id`, `titre`, `code`, `categorie`, `prix_d`, `prix_v`, `prix_pub`, `nb_page`, `color`, `descr`, `ann`) VALUES
(1, 'Informatique et Robotique au primaire N 1', 'R1', 1, 10, 15, 20, 40, 'BFFFFF', '', '26/27'),
(2, 'Informatique et Robotique au primaire N 2', 'R2', 1, 10, 15, 20, 40, 'BFFFFF', '', '26/27'),
(3, 'Informatique et Robotique au primaire N 3', 'R3', 1, 10, 15, 20, 48, 'BFFFFF', '', '26/27'),
(4, 'Informatique et Robotique au primaire N 4', 'R4', 1, 10, 15, 20, 56, 'BFFFFF', '', '26/27'),
(5, 'Informatique et Robotique au primaire N 5', 'R5', 1, 10, 15, 20, 56, 'BFFFFF', '', '26/27'),
(6, 'Informatique et Robotique au primaire N 6', 'R6', 1, 10, 15, 20, 56, 'BFFFFF', '', '26/27'),
(7, 'Informatique, Robotique et Intelligence Artificielle au collège N1', 'IA7', 2, 20, 30, 40, 96, 'FFFFFF', '', '26/27'),
(8, 'Informatique, Robotique et Intelligence Artificielle au collège N2', 'IA8', 2, 20, 30, 40, 80, 'FFFFFF', '', '26/27'),
(9, 'Thymio', 'Thy', 5, 100, 200, 300, 0, 'FFFFFF', '', '26/27'),
(10, 'mBot', 'mBot', 5, 300, 400, 500, 0, 'FFFFFF', '', '26/27');

-- --------------------------------------------------------

--
-- Structure de la table `modeles-ct`
--

CREATE TABLE `modeles-ct` (
  `id` int(11) NOT NULL,
  `nom` text NOT NULL,
  `emplacement` int(11) NOT NULL,
  `defaut` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `notif`
--

CREATE TABLE `notif` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `somme` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `notif`
--

INSERT INTO `notif` (`id`, `name`, `somme`) VALUES
(1, 'facture', 0),
(2, 'remb_fact', 0),
(3, 'depot', 0),
(4, 'CT', 0);

-- --------------------------------------------------------

--
-- Structure de la table `num_fact_26_27`
--

CREATE TABLE `num_fact_26_27` (
  `id` int(11) NOT NULL,
  `num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `online`
--

CREATE TABLE `online` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `demande_f` int(11) DEFAULT NULL,
  `time` bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `online`
--

INSERT INTO `online` (`id`, `rep`, `demande_f`, `time`) VALUES
(1, 1, NULL, 1768236488);

-- --------------------------------------------------------

--
-- Structure de la table `remb`
--

CREATE TABLE `remb` (
  `id` int(11) NOT NULL,
  `rep` text NOT NULL,
  `date` text NOT NULL,
  `banque` text NOT NULL,
  `n_cheque` text NOT NULL,
  `typeV` text NOT NULL,
  `compte` text NOT NULL,
  `montant` double NOT NULL,
  `datePV` date NOT NULL,
  `recu` int(11) NOT NULL,
  `datev` date DEFAULT NULL,
  `rejete` int(11) NOT NULL,
  `acc` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `remb`
--

INSERT INTO `remb` (`id`, `rep`, `date`, `banque`, `n_cheque`, `typeV`, `compte`, `montant`, `datePV`, `recu`, `datev`, `rejete`, `acc`, `ann`) VALUES
(1, '1', '2026-01-06', 'CIH', '123333', 'En main propre', 'MSM-MEDIAS', 2000, '2026-01-12', 1, NULL, 0, 1, '26/27'),
(2, '1', '2026-01-07', 'Banque populaire', '2564855', 'En main propre', 'Watanya', 5000, '2026-01-12', 1, NULL, 0, 1, '26/27');

-- --------------------------------------------------------

--
-- Structure de la table `remb_client`
--

CREATE TABLE `remb_client` (
  `id` int(11) NOT NULL,
  `rep` int(11) NOT NULL,
  `client` text NOT NULL,
  `date` date NOT NULL,
  `banque` text NOT NULL,
  `cheque` text NOT NULL,
  `a_lordre_de` text NOT NULL,
  `montant` double NOT NULL,
  `observation` text NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `remb_imp`
--

CREATE TABLE `remb_imp` (
  `id` int(11) NOT NULL,
  `imp` int(11) NOT NULL,
  `date` date NOT NULL,
  `banque` text NOT NULL,
  `n_cheque` text NOT NULL,
  `montant` double NOT NULL,
  `recu` int(11) NOT NULL,
  `rejete` int(11) NOT NULL,
  `ann` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `representant`
--

CREATE TABLE `representant` (
  `id` int(11) NOT NULL,
  `nom` text NOT NULL,
  `cin` text NOT NULL,
  `zone` text NOT NULL,
  `tel` text NOT NULL,
  `email` text NOT NULL,
  `adresse` text NOT NULL,
  `code_postale` text NOT NULL,
  `ville` text NOT NULL,
  `lieu_de_travail` text NOT NULL,
  `login` text NOT NULL,
  `pass` text NOT NULL,
  `bl` int(11) NOT NULL,
  `remb` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `representant`
--

INSERT INTO `representant` (`id`, `nom`, `cin`, `zone`, `tel`, `email`, `adresse`, `code_postale`, `ville`, `lieu_de_travail`, `login`, `pass`, `bl`, `remb`) VALUES
(1, 'Adnane', 'E2333233', 'Marrakech', '0662828750', 'adnanebaribi@gmail.com', '', '', '', 'Marrakech', 'ad2027', 'ad@2027', 0, 0),
(2, 'abjalil', 'E635353', 'Settat', '066666567', 'adnanebaribi@gmail.com', 'MArrakech Massira', '40000', 'Marrakech', 'MArrakech', 'jalil2027', 'jalil@2027', 7, 0);

-- --------------------------------------------------------

--
-- Structure de la table `robots`
--

CREATE TABLE `robots` (
  `id` int(11) NOT NULL,
  `id_rep` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `etablissement` text NOT NULL,
  `contact` varchar(100) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `vu` int(11) NOT NULL,
  `recu` int(11) NOT NULL,
  `ann` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `semestre`
--

CREATE TABLE `semestre` (
  `id` int(11) NOT NULL,
  `annee` text NOT NULL,
  `rep` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `semestre`
--

INSERT INTO `semestre` (`id`, `annee`, `rep`) VALUES
(1, '26/27', '/msm/1/2');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bl`
--
ALTER TABLE `bl`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bl_client`
--
ALTER TABLE `bl_client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `bl_imp`
--
ALTER TABLE `bl_imp`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cahier_de_communication`
--
ALTER TABLE `cahier_de_communication`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `carte_visites`
--
ALTER TABLE `carte_visites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Index pour la table `catalogue`
--
ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `demande_f`
--
ALTER TABLE `demande_f`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `depot`
--
ALTER TABLE `depot`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `det_fact`
--
ALTER TABLE `det_fact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `download`
--
ALTER TABLE `download`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `fact`
--
ALTER TABLE `fact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `factures_26_27`
--
ALTER TABLE `factures_26_27`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `imprimeur`
--
ALTER TABLE `imprimeur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `livre`
--
ALTER TABLE `livre`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `modeles-ct`
--
ALTER TABLE `modeles-ct`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notif`
--
ALTER TABLE `notif`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `num_fact_26_27`
--
ALTER TABLE `num_fact_26_27`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `online`
--
ALTER TABLE `online`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `remb`
--
ALTER TABLE `remb`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `remb_client`
--
ALTER TABLE `remb_client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `remb_imp`
--
ALTER TABLE `remb_imp`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `representant`
--
ALTER TABLE `representant`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `robots`
--
ALTER TABLE `robots`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `semestre`
--
ALTER TABLE `semestre`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `bl`
--
ALTER TABLE `bl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT pour la table `bl_client`
--
ALTER TABLE `bl_client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `bl_imp`
--
ALTER TABLE `bl_imp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cahier_de_communication`
--
ALTER TABLE `cahier_de_communication`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `carte_visites`
--
ALTER TABLE `carte_visites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `catalogue`
--
ALTER TABLE `catalogue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `content`
--
ALTER TABLE `content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `demande_f`
--
ALTER TABLE `demande_f`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `depot`
--
ALTER TABLE `depot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `det_fact`
--
ALTER TABLE `det_fact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `download`
--
ALTER TABLE `download`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fact`
--
ALTER TABLE `fact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `factures_26_27`
--
ALTER TABLE `factures_26_27`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `imprimeur`
--
ALTER TABLE `imprimeur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `livre`
--
ALTER TABLE `livre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `modeles-ct`
--
ALTER TABLE `modeles-ct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notif`
--
ALTER TABLE `notif`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `num_fact_26_27`
--
ALTER TABLE `num_fact_26_27`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `online`
--
ALTER TABLE `online`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `remb`
--
ALTER TABLE `remb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `remb_client`
--
ALTER TABLE `remb_client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `remb_imp`
--
ALTER TABLE `remb_imp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `representant`
--
ALTER TABLE `representant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `robots`
--
ALTER TABLE `robots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `semestre`
--
ALTER TABLE `semestre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
