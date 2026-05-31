# CMREF — Audit

## Legend  (✅ complete | ⚠️ partial | 🔧 needs reskin | ❌ missing)

**Audit scope.** This audit is based on the current repository files: React routing in `biblio/src/routes/routes.jsx`, Laravel API routing in `nexgen-lms/routes/api.php` (the repository directory is named `nexgen-lms`, not `nextgen-lms`), Ajial templates under `Ajial/representant/` and `Ajial/safe/`, routed React page files under `biblio/src/pages/`, the global store, and the season settings page.

**Master React route list extracted from `biblio/src/routes/routes.jsx`:**

| Route path | Mapped component / element |
|---|---|
| `/` | redirect to `/login` |
| `/login` | `biblio/src/pages/loginPage/login.jsx` |
| `/logout` | inline `Logout` component in `routes.jsx` |
| `/unauthorized` | `biblio/src/pages/UnauthorizedPage.jsx` |
| `/dash/home` | `biblio/src/pages/home/HomePage.jsx` |
| `/dash/livres/categories` | `biblio/src/pages/livres/categories/CategoriesPage.jsx` |
| `/dash/livres/livres` | `biblio/src/pages/livres/livre/LivresPage.jsx` |
| `/dash/fournisseurs/Fournisseurs_disponibles` | `biblio/src/pages/Fournisseurs/fourniseur_disp/FornisseurDispoPage.jsx` |
| `/dash/fournisseurs/Saisir_un_BL` | `biblio/src/pages/Fournisseurs/BL/SaisirBlPage.jsx` |
| `/dash/fournisseurs/Remboursement` | `biblio/src/pages/Fournisseurs/Remboursement/Remboursement.jsx` |
| `/dash/fournisseurs/Synthese_BL` | `biblio/src/pages/Fournisseurs/SyntheseBL/SyntheseBLPage.jsx` |
| `/dash/fournisseurs/Synthese_Remboursement` | `biblio/src/pages/Fournisseurs/SyntheseRemboursement/SyntheseRemboursementPage.jsx` |
| `/dash/representant/Representants_disponibles` | `biblio/src/pages/Représentant/ReprésentantDisponibles/ReprésentantDisponibles.jsx` |
| `/dash/representant/Saisir_un_BL` | `biblio/src/pages/Représentant/ReprésentantSaisirBl/ReprésentantSaisirBl.jsx` |
| `/dash/representant/Remboursement` | `biblio/src/pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement.jsx` |
| `/dash/representant/Demande_facturation` | `biblio/src/pages/Représentant/DemandeFacturation/DemandeFacturationPage.jsx` |
| `/dash/representant/Factures` | `biblio/src/pages/Représentant/Factures/FacturesPage.jsx` |
| `/dash/representant/Remboursement_Factures` | `biblio/src/pages/Représentant/RembourserFacture/RembourserFacturePage.jsx` |
| `/dash/representant/Declaration_Depot` | `biblio/src/pages/Représentant/DeclarationDepot/DeclarationDepotPage.jsx` |
| `/dash/representant/Cahier_texte` | `biblio/src/pages/Représentant/CahierTexte/CahierTextePage.jsx` |
| `/dash/representant/Cartes_Visite` | `biblio/src/pages/Représentant/CartesVisite/CartesVisitePage.jsx` |
| `/dash/representant/Synthese_BL` | `biblio/src/pages/Représentant/SyntheseBL/SyntheseBLPage.jsx` |
| `/dash/representant/Synthese_Remboursement` | `biblio/src/pages/Représentant/SyntheseRemboursement/SyntheseRemboursementPage.jsx` |
| `/dash/robots` | `biblio/src/pages/Robots/RobotsPage.jsx` |
| `/dash/tracabilite/clients` | `biblio/src/pages/Traçabilité/Clients/ClientsPage.jsx` |
| `/dash/tracabilite/BL_Clients` | `biblio/src/pages/Traçabilité/BLClients/BLClientsPage.jsx` |
| `/dash/tracabilite/Remboursement_Client` | `biblio/src/pages/Traçabilité/RemboursementClient/RemboursementClientPage.jsx` |
| `/dash/tracabilite/Synthese` | `biblio/src/pages/Traçabilité/Synthèse/SynthesePage.jsx` |
| `/dash/syntheses_globales/Livraison_Fournisseurs` | `biblio/src/pages/SynthèsesGlobales/LivraisonFournisseurs/LivraisonFournisseursPage.jsx` |
| `/dash/syntheses_globales/Livraison_REP` | `biblio/src/pages/SynthèsesGlobales/LivraisonREP/LivraisonREPPage.jsx` |
| `/dash/syntheses_globales/Ventes` | `biblio/src/pages/SynthèsesGlobales/Ventes/VentesPage.jsx` |
| `/dash/syntheses_globales/Depot` | `biblio/src/pages/SynthèsesGlobales/Dépôt/DepotPage.jsx` |
| `/dash/syntheses_globales/Remboursement_Fournisseurs` | `biblio/src/pages/SynthèsesGlobales/RemboursementFournisseurs/RemboursementFournisseursPage.jsx` |
| `/dash/syntheses_globales/Remboursement_REP` | `biblio/src/pages/SynthèsesGlobales/RemboursementREP/RemboursementREPPage.jsx` |
| `/dash/syntheses_globales/Balance` | `biblio/src/pages/SynthèsesGlobales/Balance/BalancePage.jsx` |
| `/dash/emailing/Simple_Email` | `biblio/src/pages/Emailing/SimpleEmail/SimpleEmailPage.jsx` |
| `/dash/emailing/Invitation` | `biblio/src/pages/Emailing/Invitation/InvitationPage.jsx` |
| `/dash/reglages/Season_travail` | `biblio/src/pages/Réglages/SaisonTravail/SaisonTravailPage.jsx` |
| `/dash/reglages/Pied_de_facture` | `biblio/src/pages/Réglages/PiedDeFacture/PiedDeFacturePage.jsx` |
| `/dash/reglages/Modeles_Cahier_texte` | `biblio/src/pages/Réglages/ModelesCahierTexte/ModelesCahierTextePage.jsx` |
| `/REP/dash/home` | `biblio/src/pages/REP/home/home.jsx` |
| `/REP/dash/bl/BL` | inline `<div>/REP/dash/bl/BL</div>` placeholder |
| `/REP/dash/bl/Remb` | inline `<div>/REP/dash/bl/Remb</div>` placeholder |
| `/REP/dash/bl/SBl` | inline `<div>/REP/dash/bl/SBl</div>` placeholder |
| `/REP/dash/factures/msm` | inline placeholder |
| `/REP/dash/factures/wataniya` | inline placeholder |
| `/REP/dash/Clients/ajouter_client` | inline placeholder |
| `/REP/dash/Clients/Saisir_un_BL` | inline placeholder |
| `/REP/dash/Clients/Remboursement` | inline placeholder |
| `/REP/dash/Clients/Synthese_BL` | inline placeholder |
| `/REP/dash/Clients/Synthese_Remboursement` | inline placeholder |
| `/REP/dash/Clients/syntheses_globales/Livraison_clients` | inline placeholder |
| `/REP/dash/Clients/syntheses_globales/Remboursement_clients` | inline placeholder |
| `/REP/dash/depot` | inline placeholder |
| `/REP/dash/cahier_texte/commander` | inline placeholder |
| `/REP/dash/cahier_texte/suivi` | inline placeholder |
| `/REP/dash/cartes_visits/commander` | inline placeholder |
| `/REP/dash/cartes_visits/suivi` | inline placeholder |
| `/REP/dash/robots` | inline placeholder |
| `/REP/dash/profil` | inline placeholder |
| `*` | redirect to `/` |

**Ajial reference pages mapped.** `Ajial/representant/` has 21 HTML templates: representative dashboard, robot list/add, BL list, representative reimbursement list/form/synthesis, cahier request/follow-up, card request/follow-up, client CRUD/BL/reimbursement/synthesis/global synthesis/history, depot declaration, MSM and Wataniya invoice requests, and profile. `Ajial/safe/` has 36 HTML templates: admin dashboard, emailing/invitation, supplier CRUD/BL/reimbursement, robot list, settings for invoice footer/models/seasons, global syntheses, traceability pages, book/category CRUD, and admin representative management pages including BL print/details, reimbursements, invoices, depot, cahier, cards, and representative syntheses.

---

## 1. Authentication

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Login | No Ajial login template in requested folders | `biblio/src/pages/loginPage/login.jsx` | ⚠️ partial | Calls `/login` with `username`, `password`, and `annee`, then stores the returned user/profile/token. Bug: non-admin login navigates to lowercase `/rep/dash/home`, but the configured route is uppercase `/REP/dash/home`. The page also calls a hardcoded CSRF URL `http://localhost:8000/sanctum/csrf-cookie`, which will not respect deployed API configuration. |
| Logout | No Ajial template | inline `Logout` in `routes.jsx`; store logic in `biblio/src/store/useAppStore.js` | ⚠️ partial | Backend logout is called, but `useAppStore.logout` prints backend debug data to the console and table. |
| Admin route guard | No Ajial template | `biblio/src/routes/protectedRoute.jsx` | ⚠️ partial | `/dash/*` is protected and admin-only. `/REP/dash/*` is not wrapped in `ProtectedRoute`, so representative pages are not guarded by React routing. |
| Unauthorized | No Ajial template | `biblio/src/pages/UnauthorizedPage.jsx` | ✅ complete | Static unauthorized screen is present. |

---

## 2. Admin Portal (/dash/*)

### 2.1 Dashboard

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Admin dashboard / stock report | `Ajial/safe/Accueil.html` | `biblio/src/pages/home/HomePage.jsx` plus `biblio/src/hooks/useStockReport.js` | ⚠️ partial | Fetches destinations, categories, and books through real services and renders a stock PDF preview, but the Ajial dashboard has destination choice and stock/livraison categories; React currently calculates only from loaded destination relations and has no active-season scope. Uses fixed category title text `Categorie : Primaire` in the accordion. |

### 2.2 Livres

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Categories | `Ajial/safe/livres/categories.html` | `biblio/src/pages/livres/categories/CategoriesPage.jsx` | ✅ complete | Uses `categoryService.getAll/create/update/delete` and matches the list + add/edit pattern. No season requirement identified for categories. |
| Livres | `Ajial/safe/livres/livres.html` | `biblio/src/pages/livres/livre/LivresPage.jsx` | ⚠️ partial | Uses `livreService` and `categoryService` for CRUD, but `annee_publication` defaults are hardcoded to `2627` instead of active season. Contains `console.error` calls. Template fields are mostly covered, but season/year is not globally wired. |

### 2.3 Fournisseurs

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Fournisseurs disponibles | `Ajial/safe/Fournisseurs/imprimeurs.html` | `biblio/src/pages/Fournisseurs/fourniseur_disp/FornisseurDispoPage.jsx` | ✅ complete | Uses `imprimeurService.getAll/create/update/delete` and covers supplier list + add/edit. |
| Saisir un BL fournisseur | `Ajial/safe/Fournisseurs/imp-bl.html` | `biblio/src/pages/Fournisseurs/BL/SaisirBlPage.jsx` | ⚠️ partial | Uses real supplier, category, book, BL, and BL-item services, with create/delete/update of BL items. Missing active-season integration: initial form and reset submit hardcode `annee: "2627"`. Template print/detail behavior is not visible in the React route. |
| Remboursement fournisseur | `Ajial/safe/Fournisseurs/imp-remb.html` | `biblio/src/pages/Fournisseurs/Remboursement/Remboursement.jsx` | ⚠️ partial | Uses real `rembImpService`, `imprimeurService`, and `banqueService` with create/update/delete/status updates. Missing Ajial credit/avance/reste summary at the same level of detail and no active-season scope. Contains console error logging. |
| Synthèse BL fournisseur | `Ajial/safe/Synthèse Global/Livraison Fournisseurs.html` and supplier BL synthesis intent | `biblio/src/pages/Fournisseurs/SyntheseBL/SyntheseBLPage.jsx` | ⚠️ partial | Uses real `bLivraisonImpService` and `livreService`, but has hardcoded year filter options (`2025 / 2026`, `2026 / 2027`, `2027 / 2028`) and an unused sample BL object embedded in the page. It filters by `row.annee` instead of active season. |
| Synthèse remboursement fournisseur | `Ajial/safe/Synthèse Global/remb_globale_imp.html` and supplier reimbursement synthesis intent | `biblio/src/pages/Fournisseurs/SyntheseRemboursement/SyntheseRemboursementPage.jsx` | ⚠️ partial | Uses real `rembImpService`, but year options are hardcoded and derived from dates rather than active season. Ajial global credit/avance/reste detail is reduced to aggregate reimbursement rows. |

### 2.4 Représentants

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Représentants disponibles | `Ajial/safe/representant/representant.html` | `biblio/src/pages/Représentant/ReprésentantDisponibles/ReprésentantDisponibles.jsx` | ⚠️ partial | Uses `representantService.getAll/create/update/delete/active_compte`, but contains console logging/error output and does not map every Ajial field visibly (e.g. full commercial/profile fields). |
| Saisir BL représentant | `Ajial/safe/representant/BL-representant.html`; print/detail templates `BL-representant/Imprimer.html` and `details.html` | `biblio/src/pages/Représentant/ReprésentantSaisirBl/ReprésentantSaisirBl.jsx` | ⚠️ partial | Uses real BL, item, representative, category, and book services with create/update/delete and Vu/Reçu actions. Missing active season: initial and reset form hardcode `annee: "2627"`. Print/detail Ajial pages are not separate routed React pages. Contains `console.log(blRes)` and `console.log("stopped")`. |
| Remboursement représentant | `Ajial/safe/representant/Remboursement.html` | `biblio/src/pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement.jsx` | ⚠️ partial | Uses real representative reimbursement and bank services with CRUD, and has totals for credit/advance/rest. Ajial has a large cheque-entry workflow with more fields/status sections; React is service-backed but not season-aware. |
| Demande facturation | `Ajial/safe/representant/fact-rep.html` | `biblio/src/pages/Représentant/DemandeFacturation/DemandeFacturationPage.jsx` | ⚠️ partial | Lists and deletes `demande-f` records and has a `handleTransform` UI action, but the page does not call the backend `/demande-f/{id}/transform` endpoint. The Ajial page separates MSM-MEDIAS and Wataniya facture blocks; React is a generic demand list. |
| Factures | `Ajial/safe/representant/factures.html` | `biblio/src/pages/Représentant/Factures/FacturesPage.jsx` | ⚠️ partial | Uses real factures and representatives for listing and save-all logic, but Ajial has six forms/eight tables for delivered quantities, invoice balances, reimbursements, accepted MSM and Wataniya factures. React is not a full match and contains `console.log(isRepSelected)`. |
| Remboursement factures | `Ajial/safe/representant/remb-fact.html` | `biblio/src/pages/Représentant/RembourserFacture/RembourserFacturePage.jsx` | ⚠️ partial | Uses `repRemboursementService` rather than the separate `rembFactureService` file. Covers facture reimbursement form/table basics, but backend has no `remboursement-factures` route and Ajial-specific reimbursement-facture semantics are not clearly separated. |
| Déclaration dépôt | `Ajial/safe/representant/depot.html` | `biblio/src/pages/Représentant/DeclarationDepot/DeclarationDepotPage.jsx` | ⚠️ partial | Uses depot and representative services and validates depot rows. Ajial shows MSM depot list and representative depot list; React centers on selecting a representative and validating deposits. No active-season filter. |
| Cahier texte | `Ajial/safe/representant/cahier_texte.html` | `biblio/src/pages/Représentant/CahierTexte/CahierTextePage.jsx` | 🔧 needs reskin | Service-backed CRUD exists for `cahier-communications`, but Ajial admin page is a cahier request follow-up with quantity totals by type. React is a generic communication table/form, not the same layout/meaning. |
| Cartes visite | `Ajial/safe/representant/carte_visite.html` | `biblio/src/pages/Représentant/CartesVisite/CartesVisitePage.jsx` | 🔧 needs reskin | Service-backed CRUD exists for `carte-visites`, but Ajial has multiple card-order tables/sections and command follow-up. React is a simplified generic card request table. |
| Synthèse BL représentant | `Ajial/safe/representant/rep-synthese.html` | `biblio/src/pages/Représentant/SyntheseBL/SyntheseBLPage.jsx` | ⚠️ partial | Uses paginated real `bLivraisonItemService`, aggregates by representative, and has KPIs. It references season in labels but only filters client-side by BL data; no global active-season state is consumed. Ajial has per-representative credit/avance/reste/recouvrement and multi-table synthesis. |
| Synthèse remboursement représentant | `Ajial/safe/representant/rep-synthese-remb.html` | `biblio/src/pages/Représentant/SyntheseRemboursement/SyntheseRemboursementPage.jsx` | ⚠️ partial | Uses paginated real reimbursement and representative services with KPI totals. Missing active-season scope and Ajial per-representative selection/detail table. |

### 2.5 Traçabilité

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Clients | `Ajial/safe/Traçabilité/Clients.html` | `biblio/src/pages/Traçabilité/Clients/ClientsPage.jsx` | ⚠️ partial | Uses real `clientService` and `representantService` CRUD. Ajial is a representative-client traceability selector/report; React is a client CRUD/assignment screen. |
| BL Clients | `Ajial/safe/Traçabilité/bl-client.html` | `biblio/src/pages/Traçabilité/BLClients/BLClientsPage.jsx` | ⚠️ partial | Uses real client sales BL services with CRUD. Missing Ajial report-only filter behavior and active-season scope. |
| Remboursement Client | `Ajial/safe/Traçabilité/remb-client.html` | `biblio/src/pages/Traçabilité/RemboursementClient/RemboursementClientPage.jsx` | ⚠️ partial | Uses client reimbursement, client, representative, and bank services with CRUD. Missing Ajial selected-representative reimbursement state and active-season scope. |
| Synthèse Traçabilité | `Ajial/safe/Traçabilité/synthese-client.html` | `biblio/src/pages/Traçabilité/Synthèse/SynthesePage.jsx` | ⚠️ partial | Uses real ventes/remboursements/clients/books and paginated fetch helpers. It computes global totals but does not expose the Ajial selected representative/client synthesis in the same detail and is not active-season scoped. |
| Activity log | No matching Ajial page in requested folders | `biblio/src/pages/Traçabilité/Activite/ActivitePage.jsx` (not routed) | ❌ missing route | Page exists and uses `activityLogService`, but there is no route in `routes.jsx` and no backend `/activity-logs` route in `api.php`. |

### 2.6 Synthèses Globales

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Livraison Fournisseurs | `Ajial/safe/Synthèse Global/Livraison Fournisseurs.html` | `biblio/src/pages/SynthèsesGlobales/LivraisonFournisseurs/LivraisonFournisseursPage.jsx` | ⚠️ partial | Uses paginated real supplier BL and books. Ajial has category-by-category tables for Primaire/Collège/Lycée and year labels; React has one aggregated table and no active-season/category-page segmentation. |
| Livraison REP | `Ajial/safe/Synthèse Global/Livraison Rep.html` | `biblio/src/pages/SynthèsesGlobales/LivraisonREP/LivraisonREPPage.jsx` | ⚠️ partial | Uses paginated real representative BL items. Missing Ajial category sections and active-year/season scoping. |
| Ventes | `Ajial/safe/Synthèse Global/vente.html` | `biblio/src/pages/SynthèsesGlobales/Ventes/VentesPage.jsx` | ⚠️ partial | Uses real client ventes and books. Missing Ajial category sections, print/export parity beyond a button, and active-season scope. |
| Dépôt | `Ajial/safe/Synthèse Global/depot_global.html` | `biblio/src/pages/SynthèsesGlobales/Dépôt/DepotPage.jsx` | ⚠️ partial | Uses real depot data. Missing Ajial repeated category/state tables and active-season scope. |
| Remboursement Fournisseurs | `Ajial/safe/Synthèse Global/remb_globale_imp.html` | `biblio/src/pages/SynthèsesGlobales/RemboursementFournisseurs/RemboursementFournisseursPage.jsx` | ⚠️ partial | Uses real `rembImpService`. Missing active-season scope and Ajial credit/avance/reste state presentation. |
| Remboursement REP | `Ajial/safe/Synthèse Global/remb_globale.html` | `biblio/src/pages/SynthèsesGlobales/RemboursementREP/RemboursementREPPage.jsx` | ⚠️ partial | Uses real `repRemboursementService`. Missing active-season scope and Ajial detailed global reimbursement state. |
| Balance | `Ajial/safe/Synthèse Global/Balance.html` | `biblio/src/pages/SynthèsesGlobales/Balance/BalancePage.jsx` | ⚠️ partial | Uses real BL, sales, reimbursement, and book services. Missing Ajial category-specific balance tables and active-season/category filters. |

### 2.7 Réglages (Settings)

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Saison de travail | `Ajial/safe/Réglage/semestre.html` | `biblio/src/pages/Réglages/SaisonTravail/SaisonTravailPage.jsx` | ⚠️ partial | Fetch/add/delete/activate are implemented through `seasonsService.getAll/create/delete/setActive`. Edit/update is not implemented even though `seasonsService.update` exists. `handleSetActiveSeason` is defined but no visible selector/button uses it; activation occurs through the boolean table cell. It stores local `activeSeason` only, not a global active season. |
| Pied de facture | `Ajial/safe/Réglage/Peid-facture.html` | `biblio/src/pages/Réglages/PiedDeFacture/PiedDeFacturePage.jsx` | ❌ missing API wiring | React page is a static form mock and explicitly says API integration is unfinished. It does not call `settingsService`; save/load is absent. |
| Modèles cahier texte | `Ajial/safe/Réglage/modeles.html` | `biblio/src/pages/Réglages/ModelesCahierTexte/ModelesCahierTextePage.jsx` | ❌ missing backend route | React uses `cahierTemplateService.getAll/create/update/delete` for `/cahier-templates`, but `api.php` has no `cahier-templates` route/controller. |

### 2.8 Emailing

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Simple Email | `Ajial/safe/Emailing/emailing.html` | `biblio/src/pages/Emailing/SimpleEmail/SimpleEmailPage.jsx` | ❌ missing API wiring | Static form only; page explicitly says integration is to be finalized and needs `POST /api/emails/send`. No such backend route exists. |
| Invitation | `Ajial/safe/Emailing/invitation.html` | `biblio/src/pages/Emailing/Invitation/InvitationPage.jsx` | ❌ missing API wiring | Static invitation form only; page explicitly says integration is to be finalized and needs `POST /api/invitations`. No such backend route exists. |
| Legacy Emailing page | No route | `biblio/src/pages/Emailing/EmailingPage.jsx` | ❌ missing route | File exists but is not routed; uses local sample/mock recipient data. |

### 2.9 Robots

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Robots | `Ajial/safe/Robot.html` and `Ajial/representant/Robot.html` | `biblio/src/pages/Robots/RobotsPage.jsx` | ⚠️ partial | Uses real `robotService` and `representantService` CRUD for admin robot tracking. Ajial representative robot page has an add form and two tables; React admin page is service-backed but not duplicated in the representative portal, where `/REP/dash/robots` is only an inline placeholder. |

---

## 3. Representative Portal (/REP/dash/*)

`biblio/src/pages/REP/` contains only `home/home.jsx` and an empty one-line file `BL/BL/bl.jsx`; the route config does not import the BL file. Every representative route except `/REP/dash/home` is an inline placeholder `<div>` in `routes.jsx`.

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| REP dashboard | `Ajial/representant/Accueil.html` | `biblio/src/pages/REP/home/home.jsx` | ❌ missing functionality | Only renders an accordion title with empty content. Ajial dashboard has welcome text and delivery/sales/stock/category dashboard content. |
| REP BL list | `Ajial/representant/bon de livraison/BL.html` | inline placeholder `/REP/dash/bl/BL` | ❌ missing | No service calls, no BL list table, no totals, no details/print. |
| REP reimbursement | `Ajial/representant/bon de livraison/Renboursement.html` | inline placeholder `/REP/dash/bl/Remb` | ❌ missing | No credit/avance/reste summary, no cheque form, no reimbursement list/status handling. |
| REP BL synthesis | `Ajial/representant/bon de livraison/synthese-bl-rep.html` | inline placeholder `/REP/dash/bl/SBl` | ❌ missing | No synthesis tables, no representative totals, no season/year awareness. |
| REP facturation MSM | `Ajial/representant/facture/facturation-msm.html` | inline placeholder `/REP/dash/factures/msm` | ❌ missing | No facture request form/list/print preview. |
| REP facturation Wataniya | `Ajial/representant/facture/facturation-wataniya.html` | inline placeholder `/REP/dash/factures/wataniya` | ❌ missing | No Wataniya facture request form/list/print preview. |
| REP clients | `Ajial/representant/client/client.html` | inline placeholder `/REP/dash/Clients/ajouter_client` | ❌ missing | No client list and add-client form. |
| REP client BL | `Ajial/representant/client/bl-client.html` | inline placeholder `/REP/dash/Clients/Saisir_un_BL` | ❌ missing | No client BL list/add form, no items table. |
| REP client reimbursement | `Ajial/representant/client/remb-client.html` | inline placeholder `/REP/dash/Clients/Remboursement` | ❌ missing | No reimbursement form/list. |
| REP client BL synthesis | `Ajial/representant/client/synthese-bl.html` | inline placeholder `/REP/dash/Clients/Synthese_BL` | ❌ missing | No client selector or detailed BL synthesis. |
| REP client reimbursement synthesis | `Ajial/representant/client/synthese-remb.html` and `Historique.html` | inline placeholder `/REP/dash/Clients/Synthese_Remboursement` | ❌ missing | No reimbursement synthesis/historical operations view. |
| REP global client delivery synthesis | `Ajial/representant/client/Synthèse Global/Livraison-global.html` | inline placeholder `/REP/dash/Clients/syntheses_globales/Livraison_clients` | ❌ missing | No category/global delivery tables. |
| REP global client reimbursement synthesis | `Ajial/representant/client/Synthèse Global/remb-global.html` | inline placeholder `/REP/dash/Clients/syntheses_globales/Remboursement_clients` | ❌ missing | No global reimbursement tables. |
| REP dépôt | `Ajial/representant/depot.html` | inline placeholder `/REP/dash/depot` | ❌ missing | No list of books in depot and no depot declaration form. |
| REP cahier command | `Ajial/representant/cahier de texte/demande_cahier.html` | inline placeholder `/REP/dash/cahier_texte/commander` | ❌ missing | No cahier model/type selection, institution fields, Arabic/French form sections, or submit action. |
| REP cahier follow-up | `Ajial/representant/cahier de texte/suivi_cahier.html` | inline placeholder `/REP/dash/cahier_texte/suivi` | ❌ missing | No demand follow-up table. |
| REP cards command | `Ajial/representant/carte de visite & chevalt/demande_carte.html` | inline placeholder `/REP/dash/cartes_visits/commander` | ❌ missing | No card/chevalet request form or model selection. |
| REP cards follow-up | `Ajial/representant/carte de visite & chevalt/suivi_cartes.html` | inline placeholder `/REP/dash/cartes_visits/suivi` | ❌ missing | No cards command follow-up tables. |
| REP robots | `Ajial/representant/Robot.html` | inline placeholder `/REP/dash/robots` | ❌ missing | No representative robot list/add workflow. |
| REP profile | `Ajial/representant/profil.html` | inline placeholder `/REP/dash/profil` | ❌ missing | No login/personal information form. |

---

## 4. Fournisseur Portal

| Page | Ajial template | React file | Status | What's missing |
|---|---|---|---|---|
| Fournisseur dashboard/portal | No `Ajial/fournisseur/` directory found in the requested reference set | No `/FOURNISSEUR/*`, `/fournisseur/*`, or supplier dashboard route in `routes.jsx` | ❌ missing | The supplier role exists in the domain description, but no routed React portal or dashboard exists. Current supplier functionality is admin-side only under `/dash/fournisseurs/*`. |

---

## 5. Backend API

### 5.1 Confirmed endpoints

**Public endpoints:**

| Method | Path | Notes |
|---|---|---|
| POST | `/api/login` | Login route. |
| GET | `/api/seasons` | Public season index. |
| GET | `/api/seasons/{season}` | Public season show. |

**Protected custom endpoints under `auth:sanctum`:**

| Method | Path | Notes |
|---|---|---|
| POST | `/api/logout` | Logout. |
| POST | `/api/active_compte` | Account activation action. |
| GET | `/api/user` | Returns authenticated user and profile. |
| DELETE | `/api/b-livraison-imps/bulk-delete/{id}` | Supplier BL group delete; route string lacks a leading slash in PHP but Laravel route definitions still register relative URI names. |
| GET | `/api/settings` | Settings index. |
| GET | `/api/settings/{key}` | Settings show. |
| POST | `/api/settings` | Settings store. |
| PUT | `/api/settings` | Settings bulk update. |
| GET | `/api/seasons/active` | Active season. |
| POST | `/api/seasons/set-active` | Set active season. |
| GET | `/api/representants/{id}/depot` | Representative depot. |
| PUT | `/api/representants/{id}/status` | Representative status. |
| POST | `/api/demande-f/{id}/transform` | Facturation transformation. |

**Protected `Route::apiResource` endpoints.** Each resource below exposes the Laravel API-resource methods: `GET /api/{resource}`, `POST /api/{resource}`, `GET /api/{resource}/{id}`, `PUT/PATCH /api/{resource}/{id}`, and `DELETE /api/{resource}/{id}`. `seasons` is the exception: protected resource routes exclude `index` and `show`, because those are public above.

| Resource | Controller | Endpoint set |
|---|---|---|
| `livres` | `LivreController` | index, store, show, update, destroy |
| `clients` | `ClientController` | index, store, show, update, destroy |
| `representants` | `RepresentantController` | index, store, show, update, destroy |
| `b-livraisons` | `BLivraisonController` | index, store, show, update, destroy |
| `b-livraison-imps` | `BLivraisonImpController` | index, store, show, update, destroy |
| `b-livraison-items` | `BLivraisonItemController` | index, store, show, update, destroy |
| `b-ventes-clients` | `BVentesClientController` | index, store, show, update, destroy |
| `cahier-communications` | `CahierCommunicationController` | index, store, show, update, destroy |
| `carte-visites` | `CarteVisiteController` | index, store, show, update, destroy |
| `catalogues` | `CatalogueController` | index, store, show, update, destroy |
| `categories` | `CategoryController` | index, store, show, update, destroy |
| `client-remboursements` | `ClientRemboursementController` | index, store, show, update, destroy |
| `contents` | `ContentController` | index, store, show, update, destroy |
| `demande-f` | `DemandeFController` | index, store, show, update, destroy |
| `depots` | `DepotController` | index, store, show, update, destroy |
| `det-fact` | `DetFactController` | index, store, show, update, destroy |
| `destinations` | `DestinationController` | index, store, show, update, destroy |
| `factures` | `FactController` | index, store, show, update, destroy |
| `fact-sequences` | `FactSequenceController` | index, store, show, update, destroy |
| `imprimeurs` | `ImprimeurController` | index, store, show, update, destroy |
| `remb-imps` | `RembImpController` | index, store, show, update, destroy |
| `rep-remboursements` | `RepRemboursementController` | index, store, show, update, destroy |
| `robots` | `RobotController` | index, store, show, update, destroy |
| `admins` | `AdminController` | index, store, show, update, destroy |
| `users` | `UserController` | index, store, show, update, destroy |
| `banques` | `BanqueController` | index, store, show, update, destroy |
| `seasons` | `SeasonController` | store, update, destroy only; index/show are public |

### 5.2 Missing or incomplete endpoints

| Missing/incomplete endpoint | Evidence / impact |
|---|---|
| `/api/emails/send` | `SimpleEmailPage.jsx` says this endpoint is required, but no route exists in `api.php`. |
| `/api/invitations` | `InvitationPage.jsx` says this endpoint is required, but no route exists in `api.php`. |
| `/api/cahier-templates` | `cahierTemplateService.js` calls this resource, and `ModelesCahierTextePage.jsx` depends on it, but no route/controller exists in `api.php` or `app/Http/Controllers/Api`. |
| `/api/activity-logs` and `/api/activity-logs/subject/{type}/{id}` | `activityLogService.js` calls these endpoints and `ActivitePage.jsx` exists, but `api.php` has no activity-log routes. |
| `/api/remboursement-factures` | `rembFactureService.js` calls it, but `api.php` has no route. Also the service imports `../api/axios`, which is the wrong relative path from `src/api/services`. |
| `/api/settings/pied-de-facture` | `PiedDeFacturePage.jsx` says this key-specific endpoint is required, but the backend only exposes generic `/settings` and `/settings/{key}`. The page does not call either. |
| `GET /api/seasons/active` service mismatch | Backend defines GET `/seasons/active`, but `seasonsService.active` uses `api.post('/seasons/active', ...)`; current page does not call it, but the service method is wrong. |
| `POST /api/demande-f/{id}/transform` not used | Backend route exists, but `DemandeFacturationPage.jsx` defines transform UI behavior without calling the route. |
| Season filtering endpoints/query contract | Many synthesis/BL pages need active-season filtering, but `api.php` only exposes active season management; there are no explicit season-scoped summary endpoints. Existing pages fetch broad resources and filter client-side or not at all. |

---

## 6. Cross-cutting concerns

| Concern | Status | Details |
|---|---|---|
| Active season in global state | ⚠️ partial | `useAppStore.js` persists `school_annee` from login response, but does not store an active season object/id from `SeasonController.active` or `SaisonTravailPage`. The settings page stores active season only locally. |
| Season CRUD/settings | ⚠️ partial | Season page implements list/add/delete and active toggle via `/seasons/set-active`; update/edit is absent. The unused `handleSetActiveSeason` sends `{ annee: activeSeason }`, while row toggling sends `{ season_id, is_active }`; this suggests an inconsistent request contract. |
| Season-aware data pages | ⚠️ partial | BL creation pages hardcode `annee: "2627"`; book publication defaults hardcode `2627`; supplier syntheses use hardcoded year options; most global synthesis and traceability pages do not consume active season. |
| Mock/static pages | ❌ missing | Emailing, invitation, invoice footer, and representative portal routes are static placeholders or forms without service calls. `EmailingPage.jsx` is not routed and uses sample/mock data. |
| Auth guards | ⚠️ partial | Admin `/dash/*` is guarded; representative `/REP/dash/*` is not. Login redirects reps to `/rep/dash/home` even though the route is `/REP/dash/home`. |
| Console/debug output | ⚠️ partial | Console output remains in store logout, login error handling, `LivresPage`, supplier reimbursement, representative list, representative BL, `FacturesPage`, and `useStockReport`. Some are commented, some active. |
| Pagination | ⚠️ partial | Several synthesis pages use `fetchAllPaginated`, but many CRUD pages call `getAll()` directly and table pagination is client-side. Backend pagination contract is not consistently reflected in pages. |
| House style | ⚠️ partial | CRUD pages increasingly follow the `LivresPage.jsx` pattern: service-backed `fetchData`, `UniversalDialog`, `MyTable`, toast/logger usage. Older/static/placeholder pages and representative portal pages do not follow this style. |
| Ajial print/detail parity | ⚠️ partial | Several Ajial templates are print/detail pages (`BL-representant/Imprimer.html`, `details.html`, facture previews). React often has no separate routes for those states. |

---

## 7. Completion summary table

| Area | Complete | Partial / reskin | Missing | Overall status |
|---|---:|---:|---:|---|
| Authentication | 1 | 3 | 0 | ⚠️ partial |
| Admin dashboard | 0 | 1 | 0 | ⚠️ partial |
| Livres | 1 | 1 | 0 | ⚠️ partial |
| Fournisseurs | 1 | 4 | 0 | ⚠️ partial |
| Admin représentants | 0 | 11 | 0 | ⚠️ partial |
| Traçabilité | 0 | 4 | 1 | ⚠️ partial |
| Synthèses globales | 0 | 7 | 0 | ⚠️ partial |
| Réglages | 0 | 1 | 2 | ⚠️ partial / ❌ backend gaps |
| Emailing | 0 | 0 | 3 | ❌ missing API wiring |
| Robots | 0 | 1 | 0 | ⚠️ partial |
| Representative portal | 0 | 0 | 20 | ❌ mostly missing |
| Fournisseur portal | 0 | 0 | 1 | ❌ missing |
| Backend API | Many resource routes present | Several route/service mismatches | Email, invitation, templates, activity logs, reimbursement-factures | ⚠️ partial |

**Highest-priority gaps:**

1. Build real `/REP/dash/*` pages; currently the representative portal is almost entirely inline placeholders.
2. Add/align missing backend endpoints for emailing, invitations, cahier templates, activity logs, and reimbursement factures, or remove unused frontend services.
3. Make active season global and consistently apply it to BL creation, books, syntheses, traceability, depot, and reports.
4. Finish settings pages: edit seasons, wire invoice footer to settings, and connect cahier templates to a real backend resource.
5. Remove console/debug output and hardcoded local URLs/season IDs before production.
