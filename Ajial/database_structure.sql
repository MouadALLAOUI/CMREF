-- Ajial MySQL database structure
-- Supports the static HTML screens and PHP blueprints for users, representatives,
-- clients, books, delivery notes, refunds, invoices, suppliers, cahiers de texte,
-- business-card orders, Robot visits, emailing, settings, deposits, and summaries.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_entries;
DROP TABLE IF EXISTS dashboard_events;
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS robot_visits;
DROP TABLE IF EXISTS carte_commandes;
DROP TABLE IF EXISTS cahier_commandes;
DROP TABLE IF EXISTS facture_lignes;
DROP TABLE IF EXISTS factures;
DROP TABLE IF EXISTS fournisseur_remboursements;
DROP TABLE IF EXISTS fournisseur_bon_livraison_lignes;
DROP TABLE IF EXISTS fournisseur_bons_livraison;
DROP TABLE IF EXISTS remboursements;
DROP TABLE IF EXISTS depot_mouvements;
DROP TABLE IF EXISTS depots;
DROP TABLE IF EXISTS bon_livraison_lignes;
DROP TABLE IF EXISTS bons_livraison;
DROP TABLE IF EXISTS client_representants;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS livre_prix;
DROP TABLE IF EXISTS livres;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS fournisseurs;
DROP TABLE IF EXISTS parametres;
DROP TABLE IF EXISTS saisons;
DROP TABLE IF EXISTS utilisateurs;
DROP TABLE IF EXISTS representants;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS villes;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE villes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    region VARCHAR(120) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_villes_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(120) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE representants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NULL,
    nom VARCHAR(160) NOT NULL,
    ville_id BIGINT UNSIGNED NULL,
    ville VARCHAR(120) NULL,
    telephone VARCHAR(50) NULL,
    email VARCHAR(190) NULL,
    adresse TEXT NULL,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_representants_code (code),
    UNIQUE KEY uq_representants_email (email),
    KEY idx_representants_ville (ville_id),
    CONSTRAINT fk_representants_ville FOREIGN KEY (ville_id) REFERENCES villes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE utilisateurs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    representant_id BIGINT UNSIGNED NULL,
    nom VARCHAR(160) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    derniere_connexion DATETIME NULL,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_utilisateurs_email (email),
    KEY idx_utilisateurs_role (role_id),
    KEY idx_utilisateurs_representant (representant_id),
    CONSTRAINT fk_utilisateurs_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_utilisateurs_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE saisons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(120) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_saisons_libelle (libelle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE parametres (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cle VARCHAR(120) NOT NULL,
    valeur TEXT NULL,
    groupe VARCHAR(80) NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_parametres_cle (cle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(160) NOT NULL,
    description TEXT NULL,
    ordre INT NOT NULL DEFAULT 0,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_categories_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE livres (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categorie_id BIGINT UNSIGNED NOT NULL,
    titre VARCHAR(255) NOT NULL,
    niveau VARCHAR(120) NULL,
    pages INT UNSIGNED NOT NULL DEFAULT 0,
    prix DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    isbn VARCHAR(32) NULL,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_livres_categorie (categorie_id),
    KEY idx_livres_titre (titre),
    CONSTRAINT fk_livres_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE livre_prix (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    livre_id BIGINT UNSIGNED NOT NULL,
    type_prix ENUM('public','representant','fournisseur') NOT NULL DEFAULT 'public',
    prix DECIMAL(12,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_livre_prix_livre (livre_id),
    CONSTRAINT fk_livre_prix_livre FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(190) NOT NULL,
    ville_id BIGINT UNSIGNED NULL,
    ville VARCHAR(120) NULL,
    telephone VARCHAR(50) NULL,
    email VARCHAR(190) NULL,
    adresse TEXT NULL,
    ice VARCHAR(80) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_clients_ville (ville_id),
    KEY idx_clients_nom (nom),
    CONSTRAINT fk_clients_ville FOREIGN KEY (ville_id) REFERENCES villes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE client_representants (
    client_id BIGINT UNSIGNED NOT NULL,
    representant_id BIGINT UNSIGNED NOT NULL,
    date_affectation DATE NOT NULL,
    PRIMARY KEY (client_id, representant_id),
    CONSTRAINT fk_client_rep_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_client_rep_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bons_livraison (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(80) NOT NULL,
    representant_id BIGINT UNSIGNED NULL,
    client_id BIGINT UNSIGNED NULL,
    fournisseur_id BIGINT UNSIGNED NULL,
    date_livraison DATE NOT NULL,
    type ENUM('BL','Livre','Specimen','Pedagogie','Retour') NOT NULL DEFAULT 'BL',
    statut ENUM('brouillon','envoye','recu','annule') NOT NULL DEFAULT 'brouillon',
    observation TEXT NULL,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bons_livraison_numero (numero),
    KEY idx_bl_representant (representant_id),
    KEY idx_bl_client (client_id),
    KEY idx_bl_date (date_livraison),
    CONSTRAINT fk_bl_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL,
    CONSTRAINT fk_bl_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT fk_bl_created_by FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bon_livraison_lignes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bon_livraison_id BIGINT UNSIGNED NOT NULL,
    livre_id BIGINT UNSIGNED NOT NULL,
    quantite INT NOT NULL DEFAULT 0,
    remise DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    prix_unitaire DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_bl_lignes_bl (bon_livraison_id),
    KEY idx_bl_lignes_livre (livre_id),
    CONSTRAINT fk_bl_lignes_bl FOREIGN KEY (bon_livraison_id) REFERENCES bons_livraison(id) ON DELETE CASCADE,
    CONSTRAINT fk_bl_lignes_livre FOREIGN KEY (livre_id) REFERENCES livres(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE depots (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    livre_id BIGINT UNSIGNED NOT NULL,
    livre VARCHAR(255) NOT NULL,
    representant_id BIGINT UNSIGNED NULL,
    quantite INT NOT NULL DEFAULT 0,
    date_depot DATE NOT NULL,
    statut ENUM('en_depot','recu','retourne','annule') NOT NULL DEFAULT 'en_depot',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_depots_livre (livre_id),
    KEY idx_depots_representant (representant_id),
    CONSTRAINT fk_depots_livre FOREIGN KEY (livre_id) REFERENCES livres(id),
    CONSTRAINT fk_depots_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE depot_mouvements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    depot_id BIGINT UNSIGNED NOT NULL,
    quantite INT NOT NULL,
    type_mouvement ENUM('entree','sortie','ajustement') NOT NULL,
    commentaire TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_depot_mouvements_depot FOREIGN KEY (depot_id) REFERENCES depots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE remboursements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    representant_id BIGINT UNSIGNED NULL,
    client_id BIGINT UNSIGNED NULL,
    facture_id BIGINT UNSIGNED NULL,
    date_remboursement DATE NOT NULL,
    banque VARCHAR(120) NULL,
    cheque_numero VARCHAR(120) NULL,
    ordre_de VARCHAR(190) NULL,
    montant DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    observation TEXT NULL,
    statut ENUM('non_recu','recu','accepte','rejete') NOT NULL DEFAULT 'non_recu',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_remb_representant (representant_id),
    KEY idx_remb_client (client_id),
    KEY idx_remb_date (date_remboursement),
    CONSTRAINT fk_remb_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL,
    CONSTRAINT fk_remb_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fournisseurs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(190) NOT NULL,
    ville_id BIGINT UNSIGNED NULL,
    ville VARCHAR(120) NULL,
    telephone VARCHAR(50) NULL,
    email VARCHAR(190) NULL,
    adresse TEXT NULL,
    ice VARCHAR(80) NULL,
    actif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_fournisseurs_ville (ville_id),
    CONSTRAINT fk_fournisseurs_ville FOREIGN KEY (ville_id) REFERENCES villes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE bons_livraison
    ADD CONSTRAINT fk_bl_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id) ON DELETE SET NULL;

CREATE TABLE fournisseur_bons_livraison (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(80) NOT NULL,
    fournisseur_id BIGINT UNSIGNED NOT NULL,
    date_livraison DATE NOT NULL,
    type ENUM('BL','Livre','Specimen','Retour') NOT NULL DEFAULT 'BL',
    statut ENUM('brouillon','envoye','recu','annule') NOT NULL DEFAULT 'brouillon',
    observation TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_fournisseur_bl_numero (numero),
    KEY idx_fournisseur_bl_fournisseur (fournisseur_id),
    CONSTRAINT fk_fournisseur_bl_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fournisseur_bon_livraison_lignes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fournisseur_bon_livraison_id BIGINT UNSIGNED NOT NULL,
    livre_id BIGINT UNSIGNED NOT NULL,
    quantite INT NOT NULL DEFAULT 0,
    prix_unitaire DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_fournisseur_bl_ligne_bl FOREIGN KEY (fournisseur_bon_livraison_id) REFERENCES fournisseur_bons_livraison(id) ON DELETE CASCADE,
    CONSTRAINT fk_fournisseur_bl_ligne_livre FOREIGN KEY (livre_id) REFERENCES livres(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fournisseur_remboursements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fournisseur_id BIGINT UNSIGNED NOT NULL,
    date_remboursement DATE NOT NULL,
    banque VARCHAR(120) NULL,
    cheque_numero VARCHAR(120) NULL,
    montant DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    statut ENUM('non_recu','recu','accepte','rejete') NOT NULL DEFAULT 'non_recu',
    observation TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_fournisseur_remb_fournisseur (fournisseur_id),
    CONSTRAINT fk_fournisseur_remb_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE factures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(80) NOT NULL,
    representant_id BIGINT UNSIGNED NULL,
    client_id BIGINT UNSIGNED NULL,
    client VARCHAR(190) NOT NULL,
    societe ENUM('MSM-MEDIAS','EL WATANIYA','FOURNISSEUR') NOT NULL DEFAULT 'MSM-MEDIAS',
    date_facture DATE NOT NULL,
    ville VARCHAR(120) NULL,
    adresse TEXT NULL,
    ice VARCHAR(80) NULL,
    total_ht DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_tva DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_ttc DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    statut ENUM('brouillon','validee','payee','annulee') NOT NULL DEFAULT 'brouillon',
    pied_facture TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_factures_numero (numero),
    KEY idx_factures_representant (representant_id),
    KEY idx_factures_client (client_id),
    CONSTRAINT fk_factures_representant FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL,
    CONSTRAINT fk_factures_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE remboursements
    ADD CONSTRAINT fk_remb_facture FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE SET NULL;

CREATE TABLE facture_lignes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    facture_id BIGINT UNSIGNED NOT NULL,
    livre_id BIGINT UNSIGNED NULL,
    designation VARCHAR(255) NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    remise DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    prix_unitaire DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_ligne DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    KEY idx_facture_lignes_facture (facture_id),
    KEY idx_facture_lignes_livre (livre_id),
    CONSTRAINT fk_facture_lignes_facture FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE,
    CONSTRAINT fk_facture_lignes_livre FOREIGN KEY (livre_id) REFERENCES livres(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cahier_commandes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    representant_id BIGINT UNSIGNED NULL,
    representant VARCHAR(190) NOT NULL,
    type_cahier VARCHAR(120) NOT NULL,
    quantite INT NOT NULL DEFAULT 0,
    modele VARCHAR(120) NULL,
    date_demande DATE NOT NULL,
    statut ENUM('demande','en_cours','livre','annule') NOT NULL DEFAULT 'demande',
    commentaire TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_cahier_rep (representant_id),
    CONSTRAINT fk_cahier_rep FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carte_commandes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    representant_id BIGINT UNSIGNED NULL,
    representant VARCHAR(190) NOT NULL,
    modele VARCHAR(120) NOT NULL,
    type_support ENUM('carte_visite','chevalet') NOT NULL DEFAULT 'carte_visite',
    quantite INT NOT NULL DEFAULT 0,
    logo_path VARCHAR(255) NULL,
    date_demande DATE NOT NULL,
    statut ENUM('demande','en_cours','prete','livree','annule') NOT NULL DEFAULT 'demande',
    commentaire TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_carte_rep (representant_id),
    CONSTRAINT fk_carte_rep FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE robot_visits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    representant_id BIGINT UNSIGNED NULL,
    date_visite DATE NOT NULL,
    ville VARCHAR(120) NOT NULL,
    etablissement VARCHAR(190) NOT NULL,
    contact VARCHAR(120) NULL,
    telephone VARCHAR(50) NULL,
    reference VARCHAR(120) NULL,
    statut ENUM('planifie','realise','annule') NOT NULL DEFAULT 'planifie',
    commentaire TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_robot_rep (representant_id),
    KEY idx_robot_date (date_visite),
    CONSTRAINT fk_robot_rep FOREIGN KEY (representant_id) REFERENCES representants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE email_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id BIGINT UNSIGNED NULL,
    destinataire VARCHAR(190) NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    corps MEDIUMTEXT NULL,
    type_message ENUM('email','invitation') NOT NULL DEFAULT 'email',
    date_envoi DATETIME NOT NULL,
    statut ENUM('brouillon','envoye','erreur') NOT NULL DEFAULT 'brouillon',
    erreur TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_email_user (utilisateur_id),
    CONSTRAINT fk_email_user FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dashboard_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(80) NOT NULL,
    date_livraison DATE NOT NULL,
    type VARCHAR(80) NOT NULL,
    statut VARCHAR(80) NOT NULL,
    source_table VARCHAR(80) NULL,
    source_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_dashboard_date (date_livraison)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(190) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(80) NOT NULL DEFAULT 'info',
    user_id BIGINT UNSIGNED NULL,
    details JSON NULL,
    KEY idx_audit_user (user_id),
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample reference data matching names and values visible in the static HTML export.
INSERT INTO villes (id, nom, region) VALUES
    (1, 'Fes', 'Fès-Meknès'),
    (2, 'Tiflet', 'Rabat-Salé-Kénitra'),
    (3, 'Tiznit', 'Souss-Massa'),
    (4, 'Casablanca', 'Casablanca-Settat')
ON DUPLICATE KEY UPDATE region = VALUES(region);

INSERT INTO roles (id, code, libelle, description) VALUES
    (1, 'safe', 'SAFE Administrateur', 'Back-office administrator role'),
    (2, 'representant', 'Représentant', 'Sales representative role')
ON DUPLICATE KEY UPDATE libelle = VALUES(libelle), description = VALUES(description);

INSERT INTO representants (id, code, nom, ville_id, ville, telephone, email) VALUES
    (1, 'REP-ADNANE', 'Adnane', 1, 'Fes', '0600000000', 'adnane@example.test'),
    (2, 'REP-DEMO', 'Mr.', 4, 'Casablanca', '0611111111', 'representant@example.test')
ON DUPLICATE KEY UPDATE nom = VALUES(nom), ville = VALUES(ville), telephone = VALUES(telephone);

INSERT INTO utilisateurs (id, role_id, representant_id, nom, email, password_hash, role) VALUES
    (1, 1, NULL, 'Administrateur SAFE', 'safe@example.test', '$2y$10$exampleHashForBlueprintOnly000000000000000000000000', 'safe'),
    (2, 2, 1, 'Adnane', 'adnane@example.test', '$2y$10$exampleHashForBlueprintOnly111111111111111111111111', 'representant')
ON DUPLICATE KEY UPDATE nom = VALUES(nom), role = VALUES(role);

INSERT INTO saisons (id, libelle, date_debut, date_fin, active) VALUES
    (1, 'Saison 2026', '2026-01-01', '2026-12-31', 1)
ON DUPLICATE KEY UPDATE active = VALUES(active);

INSERT INTO parametres (cle, valeur, groupe) VALUES
    ('pied_facture', 'Merci pour votre confiance.', 'facturation'),
    ('modele_carte_visite_defaut', 'Modèle bleu Ajial', 'cartes'),
    ('semestre_actif', 'Saison 2026', 'reglage')
ON DUPLICATE KEY UPDATE valeur = VALUES(valeur), groupe = VALUES(groupe);

INSERT INTO categories (id, nom, description, ordre) VALUES
    (1, 'Primaire', 'Livres du niveau primaire', 1),
    (2, 'Collège', 'Livres du niveau collège', 2)
ON DUPLICATE KEY UPDATE description = VALUES(description), ordre = VALUES(ordre);

INSERT INTO livres (id, categorie_id, titre, niveau, pages, prix, stock) VALUES
    (1, 1, 'Informatique et Robotique au primaire N 1', 'Primaire', 40, 45.00, 120),
    (2, 1, 'Informatique et Robotique au primaire N 2', 'Primaire', 40, 45.00, 100),
    (3, 1, 'Livre exemple 48 pages', 'Primaire', 48, 50.00, 80)
ON DUPLICATE KEY UPDATE titre = VALUES(titre), pages = VALUES(pages), stock = VALUES(stock);

INSERT INTO clients (id, nom, ville_id, ville, telephone, email, adresse) VALUES
    (1, 'Mouad the Coder | Medieval Portfolio', 1, 'Fes', '0622222222', 'client@example.test', 'Adresse client exemple')
ON DUPLICATE KEY UPDATE ville = VALUES(ville), telephone = VALUES(telephone);

INSERT INTO client_representants (client_id, representant_id, date_affectation) VALUES
    (1, 1, '2026-01-01')
ON DUPLICATE KEY UPDATE date_affectation = VALUES(date_affectation);

INSERT INTO fournisseurs (id, nom, ville_id, ville, telephone, email) VALUES
    (1, 'Fournisseur exemple', 4, 'Casablanca', '0522000000', 'fournisseur@example.test')
ON DUPLICATE KEY UPDATE ville = VALUES(ville), telephone = VALUES(telephone);

INSERT INTO bons_livraison (id, numero, representant_id, client_id, date_livraison, type, statut, observation, created_by) VALUES
    (1, '0001-2026', 1, 1, '2026-01-12', 'Livre', 'recu', 'BL exemple visible dans les pages statiques', 2),
    (2, 'Spé 01-2026', 1, 1, '2026-01-12', 'Specimen', 'recu', 'Spécimen exemple', 2)
ON DUPLICATE KEY UPDATE statut = VALUES(statut), observation = VALUES(observation);

INSERT INTO bon_livraison_lignes (bon_livraison_id, livre_id, quantite, remise, prix_unitaire) VALUES
    (1, 1, 110, 0.00, 45.00),
    (2, 1, 5, 100.00, 45.00);

INSERT INTO depots (id, livre_id, livre, representant_id, quantite, date_depot, statut) VALUES
    (1, 1, 'Informatique et Robotique au primaire N 1', 1, 10, '2026-01-15', 'en_depot')
ON DUPLICATE KEY UPDATE quantite = VALUES(quantite), statut = VALUES(statut);

INSERT INTO remboursements (id, representant_id, client_id, date_remboursement, banque, cheque_numero, ordre_de, montant, statut, observation) VALUES
    (1, 1, 1, '2026-01-20', 'Banque exemple', 'CHQ-0001', 'MSM-MEDIAS', 2000.00, 'recu', 'Avance exemple'),
    (2, 1, 1, '2026-02-01', 'Banque exemple', 'CHQ-0002', 'MSM-MEDIAS', 150.00, 'non_recu', 'Remboursement exemple')
ON DUPLICATE KEY UPDATE montant = VALUES(montant), statut = VALUES(statut);

INSERT INTO factures (id, numero, representant_id, client_id, client, societe, date_facture, ville, total_ht, total_tva, total_ttc, statut) VALUES
    (1, 'FAC-MSM-0001', 1, 1, 'Mouad the Coder | Medieval Portfolio', 'MSM-MEDIAS', '2026-02-01', 'Fes', 1000.00, 200.00, 1200.00, 'validee'),
    (2, 'FAC-WAT-0001', 1, 1, 'Mouad the Coder | Medieval Portfolio', 'EL WATANIYA', '2026-02-02', 'Fes', 800.00, 160.00, 960.00, 'brouillon')
ON DUPLICATE KEY UPDATE total_ttc = VALUES(total_ttc), statut = VALUES(statut);

INSERT INTO facture_lignes (facture_id, livre_id, designation, quantite, remise, prix_unitaire, total_ligne) VALUES
    (1, 1, 'Informatique et Robotique au primaire N 1', 10, 25.00, 45.00, 337.50),
    (2, 2, 'Informatique et Robotique au primaire N 2', 8, 25.00, 45.00, 270.00);

INSERT INTO fournisseur_bons_livraison (id, numero, fournisseur_id, date_livraison, type, statut, observation) VALUES
    (1, 'IMP-BL-1', 1, '2026-02-11', 'BL', 'recu', 'Livraison fournisseur exemple')
ON DUPLICATE KEY UPDATE statut = VALUES(statut);

INSERT INTO fournisseur_remboursements (id, fournisseur_id, date_remboursement, banque, cheque_numero, montant, statut) VALUES
    (1, 1, '2026-02-15', 'Banque fournisseur', 'IMP-CHQ-1', 150.00, 'non_recu')
ON DUPLICATE KEY UPDATE montant = VALUES(montant), statut = VALUES(statut);

INSERT INTO cahier_commandes (id, representant_id, representant, type_cahier, quantite, modele, date_demande, statut) VALUES
    (1, 1, 'Adnane', 'Cahier de communication', 50, 'Modèle c1', '2026-01-10', 'demande')
ON DUPLICATE KEY UPDATE quantite = VALUES(quantite), statut = VALUES(statut);

INSERT INTO carte_commandes (id, representant_id, representant, modele, type_support, quantite, date_demande, statut) VALUES
    (1, 1, 'Adnane', 'Carte visite 1', 'carte_visite', 100, '2026-01-11', 'en_cours'),
    (2, 1, 'Adnane', 'Chevalet standard', 'chevalet', 20, '2026-01-12', 'demande')
ON DUPLICATE KEY UPDATE quantite = VALUES(quantite), statut = VALUES(statut);

INSERT INTO robot_visits (id, representant_id, date_visite, ville, etablissement, contact, telephone, reference, statut) VALUES
    (1, 1, '2026-01-18', 'Tiflet', 'Établissement exemple', 'Mr', '0633333333', 'ROB-001', 'planifie'),
    (2, 1, '2026-01-19', 'Tiznit', 'École exemple', 'Mme', '0644444444', 'ROB-002', 'realise')
ON DUPLICATE KEY UPDATE statut = VALUES(statut);

INSERT INTO email_logs (id, utilisateur_id, destinataire, sujet, corps, type_message, date_envoi, statut) VALUES
    (1, 1, 'client@example.test', 'Invitation Ajial', 'Message d\'invitation exemple', 'invitation', '2026-01-05 09:00:00', 'envoye'),
    (2, 1, 'representant@example.test', 'Email Ajial', 'Message email exemple', 'email', '2026-01-06 10:00:00', 'brouillon')
ON DUPLICATE KEY UPDATE statut = VALUES(statut);

INSERT INTO dashboard_events (numero, date_livraison, type, statut, source_table, source_id) VALUES
    ('0001-2026', '2026-01-12', 'Livre', 'recu', 'bons_livraison', 1),
    ('Spé 01-2026', '2026-01-12', 'Specimen', 'recu', 'bons_livraison', 2);

INSERT INTO audit_entries (label, created_at, status, user_id, details) VALUES
    ('Balance primaire calculée', '2026-01-12 12:00:00', 'info', 1, JSON_OBJECT('categorie', 'Primaire')),
    ('Etat global des ventes généré', '2026-01-13 12:00:00', 'info', 1, JSON_OBJECT('module', 'vente'));
