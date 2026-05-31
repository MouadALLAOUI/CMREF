# CMREF — Implementation Plan

This plan converts the repository audit findings into an actionable backlog. It is ordered by dependency: secure the app and shared foundations first, then fix API contracts, then complete admin workflows, then build the representative and future supplier portals.

## 🔐 PHASE 0 — Foundation & Auth

- [ ] Add `ProtectedRoute` guard to `/REP/dash/*` routes; representative routes are currently rendered without an auth guard.
- [ ] Fix representative post-login redirect from `/rep/dash/home` to `/REP/dash/home` or standardize route casing across the app.
- [ ] Replace hardcoded CSRF URL `http://localhost:8000/sanctum/csrf-cookie` with environment-based API configuration.
- [ ] Remove all `console.log`, `console.table`, and debug-only console statements from auth, logout, route guards, and API interceptors.
- [ ] Add global active-season context/store state so active season ID/name/dates are available app-wide.
- [ ] Load active season on app bootstrap/login using the backend season endpoint and persist it in `useAppStore`.
- [ ] Define one canonical season payload contract for activation, e.g. `{ season_id }`, and align frontend/backend usage.
- [ ] Create `biblio/src/utils/helpers.js` or equivalent DRY organizer for shared fetch, pagination, formatting, toast, and error patterns.
- [ ] Fix `MyTable` pagination bug: reset to page 1 or previous valid page when the current page becomes empty after delete/filtering.
- [ ] Add `// MOCK — replace with API` comments to every remaining page or component that uses placeholder, sample, or hardcoded data.
- [ ] Add a no-console lint/check script or CI check for production code.
- [ ] Normalize route naming conventions (`REP`, `representant`, `reglages`, accents) and document accepted URL casing.

## 🧭 PHASE 1 — API Contract Alignment

- [ ] Add or intentionally remove frontend usage of `/api/emails/send`; `SimpleEmailPage.jsx` currently expects it.
- [ ] Add or intentionally remove frontend usage of `/api/invitations`; `InvitationPage.jsx` currently expects it.
- [ ] Add backend `cahier-templates` resource routes/controller/model or change `cahierTemplateService.js` to use an existing endpoint.
- [ ] Add backend `activity-logs` endpoints or remove/disable the unrouted Activity page and service.
- [ ] Add backend `remboursement-factures` endpoints or remove/fix `rembFactureService.js`.
- [ ] Fix `rembFactureService.js` import path from `../api/axios` to the correct relative API client path if the service remains.
- [ ] Fix `seasonsService.active` to call `GET /seasons/active` instead of POST.
- [ ] Wire `DemandeFacturationPage.jsx` transform action to `POST /api/demande-f/{id}/transform`.
- [ ] Decide whether settings use generic `/settings/{key}` or dedicated keys such as `pied-de-facture`, then update frontend accordingly.
- [ ] Add API response-shape documentation for paginated and non-paginated resources.
- [ ] Add season-aware query support where needed, e.g. `?season_id=...` or `?annee=...`, for BL, syntheses, sales, reimbursements, depot, and stock reports.
- [ ] Add backend authorization policies/middleware for admin vs representative vs future supplier access.

## 📅 PHASE 2 — Season Integration Everywhere

- [ ] Replace hardcoded `annee: "2627"` in supplier BL creation with active season from global store.
- [ ] Replace hardcoded `annee: "2627"` in representative BL creation with active season from global store.
- [ ] Replace hardcoded `annee_publication: "2627"` defaults in books with active season or explicit user-selected season.
- [ ] Replace hardcoded synthesis year options (`2025 / 2026`, `2026 / 2027`, `2027 / 2028`) with seasons fetched from API.
- [ ] Add season filters to supplier BL synthesis and supplier reimbursement synthesis.
- [ ] Add season filters to representative BL synthesis and representative reimbursement synthesis.
- [ ] Add season filters to traceability pages: clients, client BL, client reimbursement, and traceability synthesis.
- [ ] Add season filters to global syntheses: supplier deliveries, representative deliveries, sales, depot, reimbursements, and balance.
- [ ] Add season filters to admin dashboard stock reports.
- [ ] Show active season in page headers/PDF exports where Ajial templates display academic year context.
- [ ] Add empty-state messaging when no active season is configured.
- [ ] Add tests or manual QA checklist for season switching and data isolation.

## ⚙️ PHASE 3 — Settings Completion

- [ ] Implement season edit/update in `SaisonTravailPage.jsx` using `seasonsService.update`.
- [ ] Remove or wire the unused `handleSetActiveSeason` selector workflow in `SaisonTravailPage.jsx`.
- [ ] Ensure season activation cannot leave the app with zero active seasons unless that is a deliberate supported state.
- [ ] Add confirmation and validation around deleting the active season.
- [ ] Wire `PiedDeFacturePage.jsx` to real settings load/save endpoints.
- [ ] Map invoice footer settings to explicit keys: bank name, RIB, contact text, legal mentions, and payment conditions.
- [ ] Wire `ModelesCahierTextePage.jsx` to a real backend resource.
- [ ] Match Ajial settings templates for season add/delete, invoice footer fields, and cahier model list/add sections.
- [ ] Add success/error toast consistency for all settings pages.
- [ ] Add settings smoke tests or documented manual checks.

## 📚 PHASE 4 — Admin Portal Completion

### 4.1 Dashboard

- [ ] Complete dashboard stock/livraison/sales sections to match `Ajial/safe/Accueil.html`.
- [ ] Replace fixed `Categorie : Primaire` label with dynamic category sections.
- [ ] Ensure dashboard report data is active-season scoped.
- [ ] Add print/export behavior parity with Ajial stock reports.

### 4.2 Livres

- [ ] Keep category CRUD as the baseline house-style implementation.
- [ ] Make book year/season fields active-season aware.
- [ ] Remove debug console statements from `LivresPage.jsx`.
- [ ] Verify book form fields match Ajial: title, code, category, prices, pages, and publication year/season.

### 4.3 Fournisseurs

- [ ] Finish supplier BL print/detail behavior missing from React routes.
- [ ] Add active-season scoping to supplier BL list/create/update.
- [ ] Add credit/avance/reste summary parity to supplier reimbursement page.
- [ ] Add active-season scoping to supplier reimbursements.
- [ ] Remove debug console statements from supplier reimbursement workflows.
- [ ] Replace hardcoded supplier synthesis year filters with API seasons.
- [ ] Add Ajial-style category sections to supplier synthesis/PDF output.

### 4.4 Représentants — Admin

- [ ] Complete all fields from `Ajial/safe/representant/representant.html` in representative CRUD.
- [ ] Remove debug console statements from representative list and BL pages.
- [ ] Add active-season scoping to representative BL creation, list, status, and item updates.
- [ ] Build React equivalents for representative BL print and details templates.
- [ ] Complete representative reimbursement form/status fields to match Ajial cheque workflow.
- [ ] Wire facturation transformation to backend endpoint and refresh affected facture lists.
- [ ] Split MSM-MEDIAS vs Wataniya facture flows if business rules differ, matching Ajial templates.
- [ ] Complete invoice balance/delivered quantity/reimbursement/accepted facture sections from Ajial `factures.html`.
- [ ] Clarify and separate representative reimbursements vs facture reimbursements services/endpoints.
- [ ] Reskin/reshape admin cahier texte page to match Ajial request follow-up and quantity totals.
- [ ] Reskin/reshape admin cartes visite page to match Ajial multi-section order follow-up.
- [ ] Add active-season scoping to representative depot, syntheses, factures, cahier, and card pages where applicable.

### 4.5 Traçabilité

- [ ] Decide whether traceability pages are CRUD screens, reports, or both; align with Ajial report templates.
- [ ] Add representative/client selectors matching Ajial traceability templates.
- [ ] Add active-season scoping to client BL and client reimbursement reports.
- [ ] Add detailed client BL synthesis and reimbursement synthesis views.
- [ ] Add export/print support for traceability reports.
- [ ] Route or remove `ActivitePage.jsx` after the backend activity-log decision.

### 4.6 Synthèses Globales

- [ ] Add category-by-category sections for Primaire, Collège, and Lycée where Ajial provides separate tables.
- [ ] Add active-season filtering to every global synthesis page.
- [ ] Add export/print parity for every global synthesis page.
- [ ] Expand global reimbursement pages to show credit, avance, reste, and recouvrement totals.
- [ ] Expand balance page to match Ajial category-specific balance tables.
- [ ] Validate aggregate formulas against backend data and Ajial expected totals.

### 4.7 Robots

- [ ] Complete admin robot list/add/edit/status workflow to match Ajial safe robot template.
- [ ] Build representative robot workflow under `/REP/dash/robots` to match Ajial representative robot template.
- [ ] Add representative ownership/visibility restrictions for REP robot data.

## ✉️ PHASE 5 — Emailing & Invitations

- [ ] Implement backend email send endpoint or integrate an existing mail service.
- [ ] Wire `SimpleEmailPage.jsx` submit action to the backend.
- [ ] Implement backend invitation endpoint for representatives and/or suppliers.
- [ ] Wire `InvitationPage.jsx` submit action to the backend.
- [ ] Add recipient selection/autocomplete from representatives, suppliers, clients, or freeform emails as required.
- [ ] Add validation for email addresses, subject, message, invitation role, and optional attachments.
- [ ] Add sent/error/loading states and audit log records for outbound messages.
- [ ] Remove or route `EmailingPage.jsx`; if retained, replace mock recipient data with API data.

## 👤 PHASE 6 — Representative Portal Buildout

- [ ] Replace `/REP/dash/home` empty accordion with real dashboard content from `Ajial/representant/Accueil.html`.
- [ ] Build `/REP/dash/bl/BL` from `Ajial/representant/bon de livraison/BL.html`.
- [ ] Build `/REP/dash/bl/Remb` from `Ajial/representant/bon de livraison/Renboursement.html`.
- [ ] Build `/REP/dash/bl/SBl` from `Ajial/representant/bon de livraison/synthese-bl-rep.html`.
- [ ] Build `/REP/dash/factures/msm` from `Ajial/representant/facture/facturation-msm.html`.
- [ ] Build `/REP/dash/factures/wataniya` from `Ajial/representant/facture/facturation-wataniya.html`.
- [ ] Build `/REP/dash/Clients/ajouter_client` from `Ajial/representant/client/client.html`.
- [ ] Build `/REP/dash/Clients/Saisir_un_BL` from `Ajial/representant/client/bl-client.html`.
- [ ] Build `/REP/dash/Clients/Remboursement` from `Ajial/representant/client/remb-client.html`.
- [ ] Build `/REP/dash/Clients/Synthese_BL` from `Ajial/representant/client/synthese-bl.html`.
- [ ] Build `/REP/dash/Clients/Synthese_Remboursement` from `Ajial/representant/client/synthese-remb.html` and `Historique.html`.
- [ ] Build `/REP/dash/Clients/syntheses_globales/Livraison_clients` from representative global delivery synthesis template.
- [ ] Build `/REP/dash/Clients/syntheses_globales/Remboursement_clients` from representative global reimbursement synthesis template.
- [ ] Build `/REP/dash/depot` from `Ajial/representant/depot.html`.
- [ ] Build `/REP/dash/cahier_texte/commander` from `Ajial/representant/cahier de texte/demande_cahier.html`.
- [ ] Build `/REP/dash/cahier_texte/suivi` from `Ajial/representant/cahier de texte/suivi_cahier.html`.
- [ ] Build `/REP/dash/cartes_visits/commander` from `Ajial/representant/carte de visite & chevalt/demande_carte.html`.
- [ ] Build `/REP/dash/cartes_visits/suivi` from `Ajial/representant/carte de visite & chevalt/suivi_cartes.html`.
- [ ] Build `/REP/dash/robots` from `Ajial/representant/Robot.html`.
- [ ] Build `/REP/dash/profil` from `Ajial/representant/profil.html`.
- [ ] Ensure every REP API call is scoped to the authenticated representative unless admin mode is explicitly active.
- [ ] Remove unused empty file `biblio/src/pages/REP/BL/BL/bl.jsx` or route it after implementation.

## 🏭 PHASE 7 — Fournisseur Portal Planning

- [ ] Define supplier portal routes, e.g. `/FOURNISSEUR/dash/*` or `/fournisseur/dash/*`.
- [ ] Add supplier auth/role guard once route naming is chosen.
- [ ] Define supplier dashboard requirements because no Ajial supplier template exists in the audited folders.
- [ ] Identify supplier-visible data: purchase orders/BLs, payments, profile, documents, and communication.
- [ ] Add backend authorization policies for supplier-only data access.
- [ ] Build supplier dashboard shell and navigation after requirements are approved.

## 🧹 PHASE 8 — Code Quality, UX, and Consistency

- [ ] Standardize all CRUD pages around the house style used by `LivresPage.jsx`: `fetchData`, service layer, `UniversalDialog`, `MyTable`, toast, and logger.
- [ ] Remove dead imports, unused state, unused handlers, and commented debug code.
- [ ] Replace hardcoded labels that should come from data, especially category and season labels.
- [ ] Add loading, empty, and error states to every routed page.
- [ ] Ensure destructive actions have confirmation dialogs.
- [ ] Normalize French labels and typos: `Rembourcement`, `Peid`, `cartes_visits`, `déstination`, and similar names.
- [ ] Add consistent PDF/export components for BL, factures, syntheses, and traceability reports.
- [ ] Add frontend route smoke tests or a documented manual route checklist.
- [ ] Add backend route list check to catch frontend services without matching Laravel routes.
- [ ] Document the Ajial-to-React mapping in developer docs so future pages can be implemented consistently.

## ✅ PHASE 9 — Validation & Release Checklist

- [ ] Run frontend lint/build after each implementation batch.
- [ ] Run backend route list and Laravel tests after backend route changes.
- [ ] Verify all `/dash/*` admin routes require admin auth.
- [ ] Verify all `/REP/dash/*` routes require representative auth and reject anonymous access.
- [ ] Verify active season switching updates BL creation, syntheses, stock reports, and PDFs.
- [ ] Verify CRUD create/update/delete on categories, books, suppliers, representatives, BLs, reimbursements, clients, settings, robots, cahier templates, and cards.
- [ ] Verify every Ajial template has either a React implementation or an explicit documented decision to omit it.
- [ ] Verify no production route displays placeholder text like `/REP/dash/...`.
- [ ] Verify no production page displays `Intégration API à finaliser`.
- [ ] Verify no source file contains debug console output outside approved logging utilities.
- [ ] Verify PDF/print outputs match core Ajial sections and totals.
- [ ] Update `audit.md` statuses after implementation work lands.

## Suggested Delivery Order

1. **Security and season foundation:** Phase 0 + Phase 2 global plumbing.
2. **API blockers:** Phase 1 endpoints/services needed by visible pages.
3. **Settings:** Phase 3 to make seasons and global config reliable.
4. **Representative portal:** Phase 6 because most REP routes are placeholders.
5. **Admin parity:** Phase 4 sections by business priority.
6. **Emailing/invitations:** Phase 5 after API design is agreed.
7. **Supplier portal:** Phase 7 after requirements are defined.
8. **Hardening:** Phase 8 + Phase 9 before release.
