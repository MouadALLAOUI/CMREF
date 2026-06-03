# CMREF — Cahier des Charges Fonctionnel

> Document de spécification du comportement du système — Focus sur le MÉTIER, pas le code

---

## 1. Résumé Exécutif

### 1.1 Objectif

CMREF est un système de gestion intégré pour une entreprise éducative marocaine (Ajial Medias / MSM-MEDIAS) spécialisée dans l'édition, la distribution et la robotique scolaire. Le système gère le cycle complet de distribution de livres scolaires depuis l'approvisionnement auprès des imprimeurs jusqu'à la vente aux clients finals.

### 1.2 Objectifs Métier

| # | Objectif | Mesure de succès |
|---|---|---|
| 1 | Centraliser la gestion des stocks de livres | Un seul point de vérité pour toutes les opérations |
| 2 | Suivre les flux financiers (crédits, avances, restes) | Balance financière toujours à jour |
| 3 | Automatiser la facturation | Réduction du temps de traitement des factures |
| 4 | Assurer la traçabilité complète | Historique consultable de toute opération |
| 5 | Générer des rapports décisionnels | PDF et synthèses disponibles en temps réel |

### 1.3 Périmètre Fonctionnel

```
┌──────────────────────────────────────────────────────────────┐
│                    Périmètre CMREF                            │
├──────────────────────────────────────────────────────────────┤
│  ✅ Gestion du catalogue (livres, catégories)                 │
│  ✅ Gestion des fournisseurs (imprimeurs)                     │
│  ✅ Gestion des représentants territoriaux                    │
│  ✅ Gestion des clients                                       │
│  ✅ Bons de livraison (fournisseur + représentant + client)   │
│  ✅ Facturation (demande → transformation → facture)          │
│  ✅ Paiements (chèques, virements)                            │
│  ✅ Dépôts (stock chez les représentants)                     │
│  ✅ Robotique éducative                                       │
│  ✅ Cahier de texte & Cartes de visite                        │
│  ✅ Reporting & PDF                                           │
│  ✅ Saisons scolaires                                         │
│  ⚠️  Emailing (en cours d'intégration)                       │
│  ❌ Portail fournisseur (non implémenté)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Rôles Utilisateurs

### 2.1 Administrateur (SAFE)

| Aspect | Description |
|---|---|
| **Identifiant** | Login sécurisé (username + mot de passe) |
| **Portail** | Interface admin complète (`/dash/*`) |
| **Données visibles** | Toutes les données du système, toutes les saisons |
| **Permissions** | CRUD complet sur toutes les entités |
| **Responsabilités** | Gérer les représentants, fournisseurs, saison, paramètres. Superviser les opérations. Traiter les demandes de facturation. |

**Actions exclusives :**
- Activer/désactiver une saison scolaire
- Transformer une demande de facturation en facture
- Envoyer des e-mails et invitations
- Gérer les paramètres du système (pied de facture, modèles)
- Consulter le journal d'activité

### 2.2 Représentant (REP)

| Aspect | Description |
|---|---|
| **Identifiant** | Login sécurisé (username + mot de passe + année scolaire) |
| **Portail** | Interface self-service (`/REP/dash/*`) |
| **Données visibles** | Uniquement ses propres données (filtrage automatique) |
| **Permissions** | CRUD sur ses clients, BL, paiements, dépôts, robots. Lecture seule sur les livres, catégories, destinations |
| **Responsabilités** | Gérer son portefeuille clients, vendre des livres, encaisser les paiements, déclarer les dépôts |

**Actions autorisées :**
- Ajouter/modifier/supprimer des clients
- Créer des BL clients (ventes)
- Enregistrer des paiements clients
- Déclarer des dépôts de stock
- Demander une facturation
- Commander des cahiers de texte et cartes de visite
- Enregistrer des visites robots
- Consulter ses synthèses et rapports

### 2.3 Fournisseur (Imprimeur)

| Aspect | Description |
|---|---|
| **Identifiant** | Non implémenté (géré par l'admin) |
| **Portail** | Aucun |
| **Données visibles** | Aucune (géré par l'admin) |
| **Permissions** | Aucune |
| **Statut** | Le middleware `EnsureUserIsSupplier` existe mais n'est pas appliqué |

---

## 3. Exigences Fonctionnelles par Module

### 3.1 Authentification

**Objectif** : Permettre aux utilisateurs de s'authentifier de manière sécurisée.

**Fonctionnalités :**
- Formulaire de connexion avec sélection de l'année scolaire
- Authentification par username + mot de passe
- Gestion de session (token Sanctum)
- Déconnexion
- Auto-expiration après 24 heures

**Comportement attendu :**
1. L'utilisateur sélectionne l'année scolaire, saisit son identifiant et mot de passe
2. Le système vérifie les credentials dans la table `logins`
3. Si l'année sélectionnée n'est pas active, la connexion est refusée
4. Si le compte est inactif (`is_active=false`), un message d'erreur s'affiche
5. Un token d'accès est généré et stocké côté client
6. L'utilisateur est redirigé vers son portail (admin ou rep)
7. Après 24h sans activité, la session expire automatiquement

**Règles de validation :**
- L'année scolaire doit exister et être active
- Le mot de passe est vérifié en bcrypt
- Un seul login actif par utilisateur

---

### 3.2 Catalogue de Livres

**Objectif** : Maintenir un catalogue de livres organisés par catégorie.

**Fonctionnalités :**
- CRUD des catégories (Primaire, Collège, Lycée, Préscolaire, Robotos)
- CRUD des livres (titre, code, prix d'achat, prix de vente, prix public)
- Association livre ↔ catégorie

**Comportement attendu :**
- Chaque livre appartient à une catégorie
- Le code du livre est unique
- Trois niveaux de prix : achat (coût fournisseur), vente (prix rép), public (prix catalogue)
- Les représentants ne peuvent que consulter le catalogue (lecture seule)

---

### 3.3 Gestion des Saisons

**Objectif** : Structurer les opérations par année scolaire.

**Fonctionnalités :**
- CRUD des saisons (nom, dates, statut actif/inactif)
- Activation/désactivation d'une saison
- Filtrage automatique des données par saison active

**Comportement attendu :**
- Une seule saison peut être active à la fois
- L'activation d'une saison désactive automatiquement la précédente
- Toutes les données transactionnelles (BL, ventes, paiements) sont liées à une saison
- Le filtrage par saison est automatique et transparent pour l'utilisateur
- On ne peut pas supprimer la saison actuellement active

---

### 3.4 Fournisseurs (Imprimeurs)

**Objectif** : Gérer les relations avec les imprimeurs/fournisseurs.

**Fonctionnalités :**
- CRUD des fournisseurs (raison sociale, directeur, adjoint)
- BL d'entrée (fournisseur → MSM-MEDIAS)
- Paiements aux fournisseurs
- Synthèse des BL fournisseurs
- Synthèse des remboursements fournisseurs

**Comportement attendu :**
- Chaque BL fournisseur contient au moins un article (livre + quantité)
- Les articles sont sélectionnés par catégorie
- Le stock interne est mis à jour automatiquement à la réception d'un BL
- Les paiements peuvent être par chèque ou virement
- Les synthèses sont filtrables par saison

---

### 3.5 Représentants

**Objectif** : Gérer le réseau de représentants territoriaux.

**Fonctionnalités :**
- CRUD des représentants (nom, CIN, zone, contact)
- Création automatique d'un login associé
- BL de sortie (MSM-MEDIAS → Représentant)
- Paiements des représentants
- Déclaration de dépôt (stock invendu)
- Cahier de texte (commande de supports pédagogiques)
- Cartes de visite & Chevalet
- Synthèse des BL
- Synthèse des remboursements

**Comportement attendu :**
- La création d'un représentant crée automatiquement un login
- Le login du représentant est unique
- Le mot de passe est hashé en bcrypt
- Le représentant ne peut voir que ses propres données
- Le dépôt est unique par (représentant, livre)
- Le statut du BL évolue : Pending → Seen → Received

---

### 3.6 Clients

**Objectif** : Gérer la clientèle des représentants.

**Fonctionnalités :**
- CRUD des clients (raison sociale, ville, adresse, contact)
- BL clients (ventes de livres)
- Paiements clients
- Synthèse des BL clients
- Synthèse des remboursements clients

**Comportement attendu :**
- Chaque client est associé à un représentant
- Le représentant ne voit que ses propres clients
- Les villes sont prédéfinies (53 villes marocaines)
- Les paiements clients incluent le nom de la banque et le numéro de chèque
- Le champ "À l'ordre de" indique le bénéficiaire du chèque

---

### 3.7 Facturation

**Objectif** : Gérer le cycle de facturation complet.

**Fonctionnalités :**
- Demande de facturation (le rep soumet une demande)
- Transformation demande → facture (l'admin valide)
- Numérotation automatique des factures (`FACT/YY-YY/NNNN`)
- Calcul TVA (20%)
- Suivi des statuts (Brouillon → Validée → Payée / Annulée)
- Lignes de facture (détail par article)

**Comportement attendu :**
- Le rep sélectionne un client et des articles avec quantités et remises
- La demande est stockée en JSON (`contenu`)
- L'admin transforme la demande en facture
- Le numéro de facture est auto-généré et unique par saison
- Le total TTC = total HT × (1 + 20/100)
- Une demande ne peut être transformée qu'une seule fois
- Le `reste_a_payer` suit les paiements partiels

---

### 3.8 Paiements (Remboursements)

**Objectif** : Enregistrer et suivre tous les paiements.

**Types de paiements :**
1. **Paiement fournisseur** (remb_imp) : MSM-MEDIAS paie l'imprimeur
2. **Paiement représentant** (rep_remboursements) : Le rep paie MSM-MEDIAS
3. **Paiement client** (client_remboursements) : Le client paie le rep

**Fonctionnalités :**
- Enregistrement avec chèque (banque, numéro, montant)
- Types de versement : En main propre, Virement, Versement
- Statuts : Reçu, Accepté, Rejeté
- Montant et suivi des avances/restes

**Comportement attendu :**
- Chaque paiement est lié à un bénéficiaire (fournisseur, rep ou client)
- Le montant doit être positif
- Le statut évolue : en cours → reçu → accepté ou rejeté
- Les chèques rejetés sont marqués mais pas supprimés
- Le solde restant = crédit total - avance totale

---

### 3.9 Dépôt (Stock)

**Objectif** : Déclarer le stock invendu chez les représentants.

**Fonctionnalités :**
- Déclaration de dépôt (représentant + livre + quantité)
- Vue globale des dépôts par représentant
- Validation administrative

**Comportement attendu :**
- Une seule ligne de dépôt par (représentant, livre)
- La quantité en dépôt est la différence entre livré et vendu
- Le statut peut être "Actif" ou "Clôturé"
- Le dépôt est lié à une saison

---

### 3.10 Robots (Robotique Éducative)

**Objectif** : Suivre les visites de démonstration de robots.

**Fonctionnalités :**
- Enregistrement des visites (établissement, contact, référence robot)
- Suivi des statuts : Placé, En Démonstration, Retourné, Vendu
- Images des robots
- Filtrage par représentant

**Comportement attendu :**
- Chaque visite est enregistrée avec la date, l'établissement, le contact
- Le statut évolue au fil du temps
- Les images sont stockées en JSON
- Le rep ne voit que ses propres visites

---

### 3.11 Cahier de Texte & Cartes de Visite

**Objectif** : Gérer les commandes de supports pédagogiques et marketing.

**Fonctionnalités :**
- Commande de cahier de texte (école, type, quantité, modèle)
- Commande de cartes de visite (nom, fonction, modèle)
- Suivi de la production et de la livraison
- Validation des modèles

**Comportement attendu :**
- Le cahier de texte passe par un cycle : Commande → Modèle → Accepté/Refusé → Production → Livraison
- La carte de visite passe par : Commande → Conception → Validation → Production → Livraison
- Le rep peut suivre l'avancement
- Les modèles sont gérés par l'admin

---

### 3.12 Reporting & Synthèses

**Objectif** : Fournir des rapports décisionnels.

**Synthèses disponibles :**

| Rapport | Portée | Données affichées |
|---|---|---|
| Balance financière | Global | Achats, ventes, remboursements, résultat net |
| Livraison Fournisseurs → MSM-MEDIAS | Global | Quantités par fournisseur et par catégorie |
| Livraison MSM-MEDIAS → Représentants | Global | Quantités par représentant et par catégorie |
| Ventes | Global | Articles vendus, quantités, montants par catégorie |
| Dépôt | Global | Stock invendu par représentant |
| Remboursement Fournisseurs | Global | Crédit, avance, reste par fournisseur |
| Remboursement Représentants | Global | Crédit, avance, reste par représentant |
| Synthèse BL Représentant | Par rep | Livraisons reçues par catégorie |
| Synthèse Remboursement Représentant | Par rep | Paiements effectués |
| Synthèse BL Client | Par rep | Ventes par client |
| Synthèse Remboursement Client | Par rep | Paiements reçus par client |
| Synthèse Traçabilité | Global | Credit vs. avance vs. solde par client |

**Formats de sortie :**
- PDF (via `@react-pdf/renderer`)
- Écran (MyTable avec pagination, recherche, tri)

---

## 4. User Stories Détaillées

### US-01 : Connexion

**En tant que** utilisateur (admin ou représentant)
**Je veux** me connecter avec mon identifiant, mot de passe et année scolaire
**Afin d'accéder à mon portail

**Critères d'acceptance :**
- [ ] Le formulaire affiche un sélecteur d'année scolaire, un champ identifiant et un champ mot de passe
- [ ] Seules les saisons actives apparaissent dans le sélecteur
- [ ] En cas de credentials incorrects, un message d'erreur s'affiche
- [ ] En cas de compte inactif, un message d'erreur s'affiche
- [ ] Après connexion réussie, l'utilisateur est redirigé vers son portail
- [ ] Le token est stocké dans sessionStorage
- [ ] La session expire après 24 heures

---

### US-02 : Saisir un BL Fournisseur

**En tant qu'** administrateur
**Je veux** enregistrer un bon de livraison reçu d'un imprimeur
**Afin de** mettre à jour le stock interne

**Critères d'acceptance :**
- [ ] Je sélectionne le fournisseur, la date de réception et le numéro BL
- [ ] Je sélectionne les articles par catégorie (quantité par livre)
- [ ] Au moins un article doit être sélectionné
- [ ] Chaque article doit avoir une quantité > 0
- [ ] Après soumission, le stock interne est incrémenté
- [ ] Le BL est enregistré avec le statut "Pending"

---

### US-03 : Saisir un BL Représentant

**En tant qu'** administrateur ou représentant
**Je veux** allouer des livres à un représentant
**Afin de** lui fournir du stock pour la vente

**Critères d'acceptance :**
- [ ] Je sélectionne le représentant, la date, le mode d'envoi et le type (Livre/Specimen/Pedagogie/Retour)
- [ ] Je sélectionne les articles par catégorie
- [ ] Le numéro de BL est généré automatiquement
- [ ] Le stock interne est débité
- [ ] Le BL apparaît dans la liste du représentant

---

### US-04 : Vente Client

**En tant que** représentant
**Je veux** enregistrer une vente à un client
**Afin de** tracer les livres vendus

**Critères d'acceptance :**
- [ ] Je sélectionne le client, les articles, les quantités et la remise (0-50%)
- [ ] La remise est appliquée par article
- [ ] Le numéro de vente est généré automatiquement
- [ ] La vente est liée à ma session et à ma saison
- [ ] Le client apparaît dans mon portefeuille

---

### US-05 : Demander une Facturation

**En tant que** représentant
**Je veux** demander la facturation d'une vente
**Afin de** recevoir une facture officielle

**Critères d'acceptance :**
- [ ] Je sélectionne le client et les articles avec quantités et remises
- [ ] La demande est enregistrée en statut "En attente"
- [ ] L'admin peut voir toutes les demandes en attente
- [ ] Une demande transformée ne peut plus être modifiée

---

### US-06 : Transformer Demande → Facture

**En tant qu'** administrateur
**Je veux** transformer une demande de facturation en facture
**Afin de** générer un document officiel

**Critères d'acceptance :**
- [ ] Je vois la liste des demandes non transformées
- [ ] En cliquant "Transformer", la facture est créée automatiquement
- [ ] Le numéro de facture est auto-généré (format : FACT/YY-YY/NNNN)
- [ ] Le total HT, la TVA (20%) et le total TTC sont calculés automatiquement
- [ ] La facture est créée en statut "Brouillon"
- [ ] La demande est marquée comme "livree=1"

---

### US-07 : Enregistrer un Paiement

**En tant qu'** administrateur ou représentant
**Je veux** enregistrer un paiement (chèque ou virement)
**Afin de** suivre les encaissements et décaissements

**Critères d'acceptance :**
- [ ] Je sélectionne le bénéficiaire, la date, la banque, le numéro de chèque et le montant
- [ ] Le montant doit être positif
- [ ] Le paiement est enregistré en statut "En cours"
- [ ] L'admin peut marquer le paiement comme "Reçu", "Accepté" ou "Rejeté"
- [ ] Le solde restant est mis à jour automatiquement

---

### US-08 : Déclarer un Dépôt

**En tant que** représentant
**Je veux** déclarer mon stock invendu
**Afin de** le tracer dans le système

**Critères d'acceptance :**
- [ ] Je sélectionne le livre et la quantité en dépôt
- [ ] Une seule ligne par livre est autorisée
- [ ] La quantité doit être ≥ 0
- [ ] Le dépôt est lié à la saison active
- [ ] L'admin peut voir le dépôt global par représentant

---

### US-09 : Consulter la Balance Financière

**En tant qu'** administrateur
**Je veux** consulter la balance financière globale
**Afin de** comprendre la situation financière

**Critères d'acceptance :**
- [ ] Le rapport affiche les totaux : achats, ventes, remboursements, résultat net
- [ ] Le rapport est détaillé par catégorie de livre
- [ ] Le taux de recouvrement est calculé
- [ ] Le rapport est filtrable par saison
- [ ] Le rapport peut être exporté en PDF

---

### US-10 : Imprimer un Rapport PDF

**En tant qu'** utilisateur
**Je veux** générer un PDF de n'importe quel rapport
**Afin de** le partager ou l'imprimer

**Critères d'acceptance :**
- [ ] Le bouton "Imprimer" ouvre un dialog avec prévisualisation
- [ ] Le PDF contient l'en-tête Ajial Medias avec logo
- [ ] Le PDF contient les données du rapport
- [ ] Le PDF contient le pied de page avec coordonnées
- [ ] Le PDF est paginé
- [ ] L'utilisateur peut télécharger le PDF

---

## 5. Règles Métier

### 5.1 Règles Générales

| # | Règle | Justification |
|---|---|---|
| R01 | Une saison ne peut être désactivée si c'est la seule active | Éviter un état sans saison active |
| R02 | On ne peut pas supprimer la saison active | Protection des données transactionnelles |
| R03 | Le login d'un utilisateur est unique | Intégrité de l'authentification |
| R04 | Le code d'un livre est unique | Identification unique des articles |
| R05 | Le numéro de facture est unique par saison | Traçabilité comptable |
| R06 | Le représentant ne voit que ses propres données | Isolation des données |
| R07 | Les données de référence (livres, catégories) sont en lecture seule pour les reps | Cohérence du catalogue |

### 5.2 Règles de Livraison

| # | Règle | Justification |
|---|---|---|
| R08 | Un BL doit contenir au moins un article | Intégrité du document |
| R09 | Le type de BL doit être : Livre, Specimen, Pedagogie ou Retour | Classification standardisée |
| R10 | Une fois le BL confirmé "Reçu", il ne peut plus être annulé | Traçabilité |
| R11 | Le numéro de BL est généré automatiquement | Éviter les doublons |
| R12 | Le stock interne est mis à jour automatiquement à la réception d'un BL fournisseur | Cohérence du stock |
| R13 | Le stock interne est débité à la création d'un BL représentant | Suivi des allocations |

### 5.3 Règles de Facturation

| # | Règle | Justification |
|---|---|---|
| R14 | Une demande de facturation ne peut être transformée qu'une seule fois | Éviter les factures en double |
| R15 | Le numéro de facture suit le format FACT/YY-YY/NNNN | Standard comptable |
| R16 | La TVA est de 20% (taux standard marocain) | Conformité fiscale |
| R17 | Le total TTC = total HT × (1.20) | Calcul automatique |
| R18 | Le `reste_a_payer` = total TTC - somme des paiements | Suivi des encaissements |

### 5.4 Règles de Paiement

| # | Règle | Justification |
|---|---|---|
| R19 | Le montant d'un paiement doit être positif | Validation de base |
| R20 | Un paiement peut être : En cours → Reçu → Accepté/Rejeté | Workflow de validation |
| R21 | Le solde restant = crédit total - avance totale | Calcul automatique |
| R22 | Les paiements rejetés sont conservés pour audit | Traçabilité |

### 5.5 Règles de Dépôt

| # | Règle | Justification |
|---|---|---|
| R23 | Une seule ligne de dépôt par (représentant, livre) | Éviter les doublons |
| R24 | La quantité en dépôt est ≥ 0 | Validation de base |
| R25 | Le dépôt est lié à une saison | Isolation par année scolaire |

---

## 6. Comportement de l'Application par Écran

### 6.1 Page de Connexion

| Comportement | Description |
|---|---|
| **Affichage** | Formulaire avec sélecteur d'année, champ identifiant, champ mot de passe |
| **Validation** | Tous les champs sont requis |
| **Erreur** | Message "Identifiants incorrects" ou "Compte inactif" |
| **Succès** | Redirection vers le portail approprié |
| **Chargement** | Indicateur de chargement pendant la requête |

### 6.2 Tableau de Bord

| Comportement | Description |
|---|---|
| **Admin** | Stock par destination/année, widgets de résumé |
| **REP** | Stock par catégorie pour ce représentant |
| **Données** | Calculées à partir des BL, ventes et dépôts |

### 6.3 Pages CRUD (UniversalDialog)

| Comportement | Description |
|---|---|
| **Ajout** | Ouvre un dialog avec formulaire, champ ID pré-rempli si applicable |
| **Modification** | Ouvre un dialog avec les données pré-remplies |
| **Suppression** | Confirmation (AlertBox) avant suppression |
| **Consultation** | Dialog en lecture seule |
| **Validation** | Règles Laravel-style (`required`, `uuid`, `exists`, `numeric`, etc.) |
| **Succès** | Toast de succès + refresh de la liste |
| **Erreur** | Toast d'erreur + logging |

### 6.4 Pages de Synthèse

| Comportement | Description |
|---|---|
| **Filtrage** | Filtre par saison (dropdown) |
| **Calculs** | Totaux calculés en temps réel |
| **Export** | PDF via dialog de prévisualisation |
| **Vide** | Message "Aucune donnée disponible" |

### 6.5 Pages MyTable

| Comportement | Description |
|---|---|
| **Pagination** | Navigation par page |
| **Recherche** | Filtrage global par texte |
| **Tri** | Clic sur en-tête de colonne |
| **Sélection** | Cases à cocher multi-sélection |
| **Actions** | Boutons Modifier/Supprimer/Voir par ligne |
| **Vide** | Message "Aucune donnée" |

---

## 7. Règles d'Évolution de la Base de Données

### 7.1 Ajout d'une Colonne

| Étape | Action | Responsable |
|---|---|---|
| 1 | Créer la migration Laravel (`php artisan make:migration`) | Développeur |
| 2 | Définir le type, les contraintes, la valeur par défaut | Développeur |
| 3 | Exécuter la migration (`php artisan migrate`) | Développeur |
| 4 | Mettre à jour le modèle (ajouter à `$fillable`) | Développeur |
| 5 | Mettre à jour le frontend si la colonne est affichée | Développeur |
| 6 | Vérifier la rétrocompatibilité (anciennes données) | Développeur |

**Impact :**
- Si la colonne est `nullable` → pas d'impact sur les données existantes
- Si la colonne a une valeur par défaut → les lignes existantes reçoivent cette valeur
- Si la colonne est `required` sans défaut → migration échoue sur données existantes

### 7.2 Suppression d'une Colonne

| Étape | Action | Responsable |
|---|---|---|
| 1 | Vérifier qu'aucune requête n'utilise la colonne | Développeur |
| 2 | Retirer la colonne du modèle `$fillable` | Développeur |
| 3 | Retirer la colonne du frontend | Développeur |
| 4 | Créer la migration de suppression | Développeur |
| 5 | Exécuter la migration | Développeur |

**Impact :**
- Perte irréversible des données
- Toute API retournant cette colonne échoue
- Tout formulaire utilisant cette colonne affiche une erreur

### 7.3 Ajout d'une Table

| Étape | Action | Responsable |
|---|---|---|
| 1 | Créer le modèle Laravel | Développeur |
| 2 | Créer la migration | Développeur |
| 3 | Créer le contrôleur API | Développeur |
| 4 | Ajouter les routes | Développeur |
| 5 | Créer le service frontend | Développeur |
| 6 | Créer la page frontend | Développeur |
| 7 | Ajouter à la sidebar | Développeur |

### 7.4 Suppression d'une Table

| Étape | Action | Responsable |
|---|---|---|
| 1 | Vérifier toutes les FK qui référencent la table | Développeur |
| 2 | Retirer les FK ou ajouter ON DELETE approprié | Développeur |
| 3 | Retirer le service frontend | Développeur |
| 4 | Retirer la page frontend | Développeur |
| 5 | Retirer les routes | Développeur |
| 6 | Supprimer le contrôleur | Développeur |
| 7 | Créer la migration de suppression | Développeur |

### 7.5 Changement de Relations

| Étape | Action | Responsable |
|---|---|---|
| 1 | Analyser l'impact sur les requêtes | Développeur |
| 2 | Mettre à jour les modèles (relations Eloquent) | Développeur |
| 3 | Mettre à jour les contrôleurs | Développeur |
| 4 | Mettre à jour le frontend | Développeur |
| 5 | Tester toutes les pages affectées | QA |

---

## 8. Règles de Résolution de Conflits

### 8.1 Incohérence de Données

| Conflit | Détection | Expérience Utilisateur | Résolution |
|---|---|---|---|
| Stock négatif | Requête API retourne quantité < 0 | Toast erreur | Corriger le BL source |
| Montant incohérent | Total lignes ≠ total facture | Alerte dans le dialog | Recalculer les lignes |
| Paiement > crédit | `montant > credit` | Refus de soumission | Informer l'utilisateur |

### 8.2 Intégrité Référentielle

| Conflit | Détection | Expérience Utilisateur | Résolution |
|---|---|---|---|
| FK manquante | Erreur 500 API | Toast erreur | Vérifier les données |
| Suppression cascade | Les données enfants disparaissent | Pas visible (silencieux) | Vérifier ON DELETE avant suppression |
| Doublon unique | Erreur SQL 23505 | Toast erreur "existe déjà" | Modifier l'enregistrement existant |

### 8.3 Mises à Jour Concurrentes

| Conflit | Détection | Expérience Utilisateur | Résolution |
|---|---|---|---|
| Deux admins modifient la même saison | Dernière écriture gagne | Pas de conflit visible | Accepter la dernière écriture |
| Deux reps créent le même numéro de BL | Contrainte unique | Toast erreur | Le numéro est auto-généré (peu probable) |
| Activation simultanée de saisons | Race condition | État aléatoire | Ajouter un verrou en base |

---

## 9. Politique de Gestion des Erreurs

### 9.1 Erreurs de Validation

| Type | Message Utilisateur | Action |
|---|---|---|
| Champ requis manquant | "Ce champ est obligatoire" | Surligner le champ en rouge |
| Type invalide | "Format invalide" | Afficher le format attendu |
| FK inexistante | "Élément introuvable" | Rafraîchir la liste déroulante |
| Doublon | "Cet élément existe déjà" | Proposer la modification |

### 9.2 Erreurs de Permission

| Type | Message Utilisateur | Action |
|---|---|---|
| Non authentifié | Redirection vers `/login` | Supprimer le token |
| Accès interdit | "Accès non autorisé" | Redirection vers `/unauthorized` |
| Rôle insuffisant | "Vous n'avez pas les droits" | Masquer les boutons non autorisés |

### 9.3 Erreurs API

| Type | Code | Message Utilisateur | Action |
|---|---|---|---|
| Serveur indisponible | 500 | "Erreur serveur, réessayez" | Logger l'erreur |
| Timeout | 408 | "Délai d'attente dépassé" | Proposer un retry |
| Données introuvables | 404 | "Élément non trouvé" | Rafraîchir la liste |
| Données conflictuelles | 409 | "Conflit de données" | Afficher les détails |

### 9.4 Erreurs Réseau

| Type | Message Utilisateur | Action |
|---|---|---|
| Pas de connexion | "Vérifiez votre connexion" | Proposer un retry |
| API hors ligne | "Service temporairement indisponible" | Logger + retry |

---

## 10. Exigences de Sécurité

### 10.1 Authentification

| Exigence | Implémentation |
|---|---|
| Mots de passe hashés | bcrypt via Laravel |
| Tokens d'accès | Sanctum (Personal Access Tokens) |
| Expiration de session | 24 heures (côté client) |
| CSRF protection | Exclue pour les routes API |
| Rate limiting | Non implémenté (recommandé) |

### 10.2 Autorisation

| Exigence | Implémentation |
|---|---|
| Rôle admin | Middleware `admin` sur routes sensibles |
| Rôle rep | Filtrage automatique `ScopedByRepresentant` |
| Lecture seule | Middleware `read_only_rep` sur les données de référence |
| Portail séparé | Routes `/dash/*` (admin) vs `/REP/dash/*` (rep) |

### 10.3 Gestion des Sessions

| Exigence | Implémentation |
|---|---|
| Stockage | `sessionStorage` (pas de localStorage) |
| Persistance | Tant que l'onglet est ouvert |
| Déconnexion | Suppression du token + du sessionStorage |
| Multi-onglet | Chaque onglet a sa propre session |

### 10.4 Restrictions d'Accès

| Règle | Description |
|---|---|
| Le rep ne voit que ses données | `ScopedByRepresentant` sur tous les modèles transactionnels |
| Le rep ne modifie pas les livres | `read_only_rep` sur les routes de référence |
| L'admin voit tout | Pas de scope appliqué pour les admins |
| La saison filtre les données | `FilterBySeason` sur les modèles transactionnels |

---

## 11. Exigences Non-Fonctionnelles

### 11.1 Performance

| Métrique | Cible |
|---|---|
| Temps de chargement initial | < 3 secondes |
| Temps de réponse API | < 1 seconde |
| Temps de génération PDF | < 5 secondes |
| Pagination | 10-15 lignes par page |

### 11.2 Scalabilité

| Aspect | Stratégie |
|---|---|
| Données | Pagination côté API + côté client |
| Saisons | Filtrage automatique réduit le volume de données |
| PDF | Génération à la demande (pas de pré-génération) |

### 11.3 Disponibilité

| Aspect | Stratégie |
|---|---|
| Session | `sessionStorage` — pas de persistance longue durée |
| API | Sanctum — token valide tant que non expiré |
| Données | UUID primary keys — pas de collision |

### 11.4 Maintenabilité

| Aspect | Stratégie |
|---|---|
| Code | Patterns réutilisables (UniversalDialog, MyTable, PdfDialogViewer) |
| API | CRUD standard (`apiResource`) |
| Frontend | Services API standardisés |
| Styles | Tailwind CSS — classes utility |

### 11.5 Auditabilité

| Aspect | Stratégie |
|---|---|
| Journal d'activité | Spatie Activity Log |
| Événements | `RepresentantUpdated` broadcast |
| Logs | `logger()` function (env-guarded) |
| Historique des e-mails | `email_logs` table |

---

## 12. Fonctionnalités Manquantes

### 12.1 Pages Manquantes

| Page | Statut | Recommandation |
|---|---|---|
| Portail Fournisseur | Non implémenté | Créer un portail dédié avec login, vue des BL et paiements |
| Profil REP (changement MDP) | TODO | Connecter au backend |
| RemboursementFacturesPage | Orpheline | Importer dans les routes ou supprimer |

### 12.2 APIs Manquantes

| API | Statut | Recommandation |
|---|---|---|
| Envoi d'e-mails réel | Stub (log uniquement) | Implémenter SMTP |
| Export CSV | Non implémenté | Ajouter aux pages de synthèse |
| Notifications WebSocket | Non implémenté | Ajouter pour les statuts BL |
| Dashboard avec graphiques | Non implémenté | Ajouter Chart.js/Recharts |

### 12.3 Workflows Manquants

| Workflow | Statut | Recommandation |
|---|---|---|
| Validation des BL par l'admin | Partiel | Ajouter workflow de validation formelle |
| Rapprochement bancaire | Non implémenté | Ajouter matching paiement ↔ chèque |
| Alertes de stock minimum | Non implémenté | Ajouter notifications quand le stock est bas |
| Historique des modifications | Partiel (Spatie) | Rendre visible dans l'interface admin |

### 12.4 Logique Métier Manquante

| Logique | Statut | Recommandation |
|---|---|---|
| Calcul automatique du dépôt | Non implémenté | Déduit de (livré - vendu) |
| Blocage de la facturation si solde négatif | Non implémenté | Vérifier avant création de facture |
| Relance automatique des impayés | Non implémenté | Ajouter un système de relance |
| Rapport de comparaison inter-saisons | Non implémenté | Ajouter dans les synthèses globales |
