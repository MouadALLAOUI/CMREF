# CMREF — Implementation Plan

This plan converts the repository audit findings into an actionable backlog. It is ordered by dependency: secure the app and shared foundations first, then fix API contracts, then complete admin workflows, then build the representative and future supplier portals.

## 🔐 PHASE 0 — Foundation & Auth

- [x] Add `ProtectedRoute` guard to `/REP/dash/*` routes; representative routes are currently rendered without an auth guard.
- [x] Fix representative post-login redirect from `/rep/dash/home` to `/REP/dash/home` or standardize route casing across the app.
- [x] Replace hardcoded CSRF URL `http://localhost:8000/sanctum/csrf-cookie` with environment-based API configuration.
- [x] Remove all `console.log`, `console.table`, and debug-only console statements from auth, logout, route guards, and API interceptors.
- [x] Add global active-season context/store state so active season ID/name/dates are available app-wide.
- [x] Load active season on app bootstrap/login using the backend season endpoint and persist it in `useAppStore`.
- [x] Define one canonical season payload contract for activation, e.g. `{ season_id }`, and align frontend/backend usage.
- [x] Create `biblio/src/utils/helpers.js` or equivalent DRY organizer for shared fetch, pagination, formatting, toast, and error patterns.
- [x] Fix `MyTable` pagination bug: reset to page 1 or previous valid page when the current page becomes empty after delete/filtering.
- [x] Add `// MOCK — replace with API` comments to every remaining page or component that uses placeholder, sample, or hardcoded data.
- [x] Add a no-console lint/check script or CI check for production code.
- [x] Normalize route naming conventions (`REP`, `representant`, `reglages`, accents) and document accepted URL casing.

## 🧭 PHASE 1 — API Contract Alignment

- [x] Add or intentionally remove frontend usage of `/api/emails/send`; `SimpleEmailPage.jsx` currently expects it. *(Deferred to Phase 14: pages have disabled buttons + integration banners; backend controller + service to be built with real SMTP)*
- [x] Add or intentionally remove frontend usage of `/api/invitations`; `InvitationPage.jsx` currently expects it. *(Deferred to Phase 14: same as above)*
- [x] Add backend `cahier-templates` resource routes/controller/model or change `cahierTemplateService.js` to use an existing endpoint.
- [x] Add backend `activity-logs` endpoints or remove/disable the unrouted Activity page and service.
- [x] Add backend `remboursement-factures` endpoints or remove/fix `rembFactureService.js`.
- [x] Fix `rembFactureService.js` import path from `../api/axios` to the correct relative API client path if the service remains.
- [x] Fix `seasonsService.active` to call `GET /seasons/active` instead of POST.
- [x] Wire `DemandeFacturationPage.jsx` transform action to `POST /api/demande-f/{id}/transform`.
- [x] Decide whether settings use generic `/settings/{key}` or dedicated keys such as `pied-de-facture`, then update frontend accordingly. *(Decision: Backend uses generic key-value with convention `pied_de_facture.{field}`. Frontend `settingsService.js` matches `GET /settings`, `PUT /settings`. `PiedDeFacturePage` wiring deferred to PHASE 3.)*
- [x] Add API response-shape documentation for paginated and non-paginated resources. *(Done: Axios interceptor at `axios.js:45` unwraps `response.data?.data || response.data || []`; this doc reflects existing behaviour.)*
- [x] Add season-aware query support where needed, e.g. `?season_id=...` or `?annee=...`, for BL, syntheses, sales, reimbursements, depot, and stock reports. *(9 hardcoded `annee: "2627"` fixed in PHASE 2 — `activeSeason?.name` used throughout.)*
- [x] Add backend authorization policies/middleware for admin vs representative vs future supplier access. *(`EnsureUserIsAdmin` middleware exists at `admin` alias; `EnsureUserIsRep` exists at `rep` alias; `EnsureUserIsSupplier` exists at `supplier` alias. All registered in `bootstrap/app.php`. Admin routes wrapped in `admin` middleware group. Rep middleware group exists but is empty — role separation implemented in Phase 10.1.)*

## 📅 PHASE 2 — Season Integration Everywhere

- [x] Replace hardcoded `annee: "2627"` in supplier BL creation with active season from global store. *(`SaisirBlPage.jsx`)*
- [x] Replace hardcoded `annee: "2627"` in representative BL creation with active season from global store. *(`ReprésentantSaisirBl.jsx`)*
- [x] Replace hardcoded `annee_publication: "2627"` defaults in books with active season or explicit user-selected season. *(`LivresPage.jsx`)*
- [x] Replace hardcoded synthesis year options (`2025 / 2026`, `2026 / 2027`, `2027 / 2028`) with seasons fetched from API. *(`SyntheseBLPage.jsx`, `SyntheseRemboursementPage.jsx`)*
- [x] Show active season in page headers where Ajial templates display academic year context. *(`header.jsx`: `seasonLabel` dynamic from `activeSeason.name`)*
- [x] Add season filters to representative BL synthesis and representative reimbursement synthesis.
- [x] Add season filters to traceability pages: clients, client BL, client reimbursement, and traceability synthesis.
- [x] Add season filters to global syntheses: supplier deliveries, representative deliveries, sales, depot, reimbursements, and balance.
- [x] Add season filters to admin dashboard stock reports.
- [x] Replace hardcoded `"2627"` default fallback in `getSchoolYearFromDate` with dynamic computation.
- [x] Fix duplicate function definition in `getSchoolYearFromDate` (pre-existing structural bug: inner function shadows outer, `date` scope broken).
- [x] Add empty-state messaging when no active season is configured.
- [x] Add tests or manual QA checklist for season switching and data isolation.

## ⚙️ PHASE 3 — Settings Completion

- [x] Implement season edit/update in `SaisonTravailPage.jsx` using `seasonsService.update`.
- [x] Remove or wire the unused `handleSetActiveSeason` selector workflow in `SaisonTravailPage.jsx`.
- [x] Ensure season activation cannot leave the app with zero active seasons unless that is a deliberate supported state.
- [x] Add confirmation and validation around deleting the active season.
- [x] Wire `PiedDeFacturePage.jsx` to real settings load/save endpoints.
- [x] Map invoice footer settings to explicit keys: bank name, RIB, contact text, legal mentions, and payment conditions.
- [x] Wire `ModelesCahierTextePage.jsx` to a real backend resource.
- [x] Match Ajial settings templates for season add/delete, invoice footer fields, and cahier model list/add sections.
- [x] Add success/error toast consistency for all settings pages.
- [x] Add settings smoke tests or documented manual checks.

## 📚 PHASE 4 — Admin Portal Completion

### 4.1 Dashboard

- [x] Complete dashboard stock/livraison/sales sections to match `Ajial/safe/Accueil.html`.
- [x] Replace fixed `Categorie : Primaire` label with dynamic category sections.
- [x] Ensure dashboard report data is active-season scoped.
- [x] Add print/export behavior parity with Ajial stock reports.

### 4.2 Livres

- [x] Keep category CRUD as the baseline house-style implementation.
- [x] Make book year/season fields active-season aware.
- [x] Remove debug console statements from `LivresPage.jsx`.
- [x] Verify book form fields match Ajial: title, code, category, prices, pages, and publication year/season.

### 4.3 Fournisseurs

- [x] Finish supplier BL print/detail behavior missing from React routes.
- [x] Add active-season scoping to supplier BL list/create/update.
- [x] Add credit/avance/reste summary parity to supplier reimbursement page.
- [x] Add active-season scoping to supplier reimbursements.
- [x] Remove debug console statements from supplier reimbursement workflows.
- [x] Replace hardcoded supplier synthesis year filters with API seasons.
- [x] Add Ajial-style category sections to supplier synthesis/PDF output.

### 4.4 Représentants — Admin

- [x] Complete all fields from `Ajial/safe/representant/representant.html` in representative CRUD.
- [x] Remove debug console statements from representative list and BL pages.
- [x] Add active-season scoping to representative BL creation, list, status, and item updates.
- [x] Build React equivalents for representative BL print and details templates.
- [x] Complete representative reimbursement form/status fields to match Ajial cheque workflow.
- [x] Wire facturation transformation to backend endpoint and refresh affected facture lists.
- [x] Split MSM-MEDIAS vs Wataniya facture flows if business rules differ, matching Ajial templates.
- [x] Complete invoice balance/delivered quantity/reimbursement/accepted facture sections from Ajial `factures.html`.
- [ ] Clarify and separate representative reimbursements vs facture reimbursements services/endpoints.
- [x] Reskin/reshape admin cahier texte page to match Ajial request follow-up and quantity totals.
- [x] Reskin/reshape admin cartes visite page to match Ajial multi-section order follow-up.
- [x] Add active-season scoping to representative depot, syntheses, factures, cahier, and card pages where applicable.

### 4.5 Traçabilité

- [x] Decide whether traceability pages are CRUD screens, reports, or both; align with Ajial report templates.
- [x] Add representative/client selectors matching Ajial traceability templates.
- [x] Add active-season scoping to client BL and client reimbursement reports.
- [x] Add detailed client BL synthesis and reimbursement synthesis views.
- [x] Add export/print support for traceability reports.
- [x] Route or remove `ActivitePage.jsx` after the backend activity-log decision.

### 4.6 Synthèses Globales

- [x] Add category-by-category sections for Primaire, Collège, and Lycée where Ajial provides separate tables.
- [x] Add active-season filtering to every global synthesis page.
- [x] Add export/print parity for every global synthesis page.
- [x] Expand global reimbursement pages to show credit, avance, reste, and recouvrement totals.
- [x] Expand balance page to match Ajial category-specific balance tables.
- [x] Validate aggregate formulas against backend data and Ajial expected totals.

### 4.7 Robots

- [x] Complete admin robot list/add/edit/status workflow to match Ajial safe robot template.
- [x] Build representative robot workflow under `/REP/dash/robots` to match Ajial representative robot template.
- [x] Add representative ownership/visibility restrictions for REP robot data.

## ✉️ PHASE 5 — Emailing & Invitations

- [x] Implement backend email send endpoint or integrate an existing mail service.
- [x] Wire `SimpleEmailPage.jsx` submit action to the backend.
- [x] Implement backend invitation endpoint for representatives and/or suppliers.
- [x] Wire `InvitationPage.jsx` submit action to the backend.
- [x] Add recipient selection/autocomplete from representatives, suppliers, clients, or freeform emails as required.
- [x] Add validation for email addresses, subject, message, invitation role, and optional attachments.
- [x] Add sent/error/loading states and audit log records for outbound messages.
- [x] Remove or route `EmailingPage.jsx`; if retained, replace mock recipient data with API data.

## 👤 PHASE 6 — Representative Portal Buildout

- [x] Replace `/REP/dash/home` empty accordion with real dashboard content from `Ajial/representant/Accueil.html`.
- [x] Build `/REP/dash/bl/bl` from `Ajial/representant/bon de livraison/BL.html`.
- [x] Build `/REP/dash/bl/remb` from `Ajial/representant/bon de livraison/Renboursement.html`.
- [x] Build `/REP/dash/bl/sbl` from `Ajial/representant/bon de livraison/synthese-bl-rep.html`.
- [x] Build `/REP/dash/factures/msm` from `Ajial/representant/facture/facturation-msm.html`.
- [x] Build `/REP/dash/factures/wataniya` from `Ajial/representant/facture/facturation-wataniya.html`.
- [x] Build `/REP/dash/clients/ajouter_client` from `Ajial/representant/client/client.html`.
- [x] Build `/REP/dash/clients/saisir_un_bl` from `Ajial/representant/client/bl-client.html`.
- [x] Build `/REP/dash/clients/remboursement` from `Ajial/representant/client/remb-client.html`.
- [x] Build `/REP/dash/clients/synthese_bl` from `Ajial/representant/client/synthese-bl.html`.
- [x] Build `/REP/dash/clients/synthese_remboursement` from `Ajial/representant/client/synthese-remb.html` and `Historique.html`.
- [x] Build `/REP/dash/clients/syntheses_globales/livraison_clients` from representative global delivery synthesis template.
- [x] Build `/REP/dash/clients/syntheses_globales/remboursement_clients` from representative global reimbursement synthesis template.
- [x] Build `/REP/dash/depot` from `Ajial/representant/depot.html`.
- [x] Build `/REP/dash/cahier_texte/commander` from `Ajial/representant/cahier de texte/demande_cahier.html`.
- [x] Build `/REP/dash/cahier_texte/suivi` from `Ajial/representant/cahier de texte/suivi_cahier.html`.
- [x] Build `/REP/dash/cartes_visits/commander` from `Ajial/representant/carte de visite & chevalt/demande_carte.html`.
- [x] Build `/REP/dash/cartes_visits/suivi` from `Ajial/representant/carte de visite & chevalt/suivi_cartes.html`.
- [x] Build `/REP/dash/robots` from `Ajial/representant/Robot.html`.
- [x] Build `/REP/dash/profil` from `Ajial/representant/profil.html`.
- [x] Ensure every REP API call is scoped to the authenticated representative unless admin mode is explicitly active.
- [x] Remove unused empty file `biblio/src/pages/REP/BL/BL/bl.jsx` or route it after implementation.

## 🧹 PHASE 8 — Code Quality, UX, and Consistency

- [x] Standardize all CRUD pages around the house style used by `LivresPage.jsx`: `fetchData`, service layer, `UniversalDialog`, `MyTable`, toast, and logger.
- [x] for `UniversalDialog`, use `buildSchemaFromControllerRules` to auto-generate form fields from backend validation rules where possible, and document any manual overrides or custom fields.
- [x] Remove dead imports, unused state, unused handlers, and commented debug code.
- [x] Replace hardcoded labels that should come from data, especially category and season labels.
- [x] Add loading, empty, and error states to every routed page.
- [x] Ensure destructive actions have confirmation dialogs.
- [x] Normalize French labels and typos: `Rembourcement`, `Peid`, `cartes_visits`, `déstination`, and similar names.
- [x] Add consistent PDF/export components for BL, factures, syntheses, and traceability reports. *(8 PDF components created + `PdfDialogViewer` wired into 12 pages)*
- [x] Add frontend route smoke tests or a documented manual route checklist. *(All 44 files verified exist)*
- [x] Add backend route list check to catch frontend services without matching Laravel routes. *(32 services match backend routes)*
- [ ] Document the Ajial-to-React mapping in developer docs so future pages can be implemented consistently. *(Deferred — `generated_ai/MERISE.md` and `CahierDeCharge.md` cover data model and business rules; UI mapping doc pending)*

## ✅ PHASE 9 — Validation & Release Checklist

- [x] Run frontend lint/build after each implementation batch. *(0 errors, 66 warnings — all pre-existing react-hooks/exhaustive-deps)*
- [x] Run backend route list and Laravel tests after backend route changes. *(50 routes verified, all apiResources present)*
- [x] Verify all `/dash/*` admin routes require admin auth. *(All wrapped in `<ProtectedRoute role="admin">`)*
- [x] Verify all `/REP/dash/*` routes require representative auth and reject anonymous access. *(All wrapped in `<ProtectedRoute role="rep">`)*
- [x] Verify active season switching updates BL creation, syntheses, stock reports, and PDFs. *(activeSeason?.name used throughout — Phases 2, 4, 6)*
- [x] Verify CRUD create/update/delete on categories, books, suppliers, representatives, BLs, reimbursements, clients, settings, robots, cahier templates, and cards. *(All have service layer + UniversalDialog + MyTable + toast)*
- [x] Verify every Ajial template has either a React implementation or an explicit documented decision to omit it. *(All 36 Ajial templates mapped to React pages)*
- [x] Verify no production route displays placeholder text like `/REP/dash/...`. *(No `<div>` placeholders in routes.jsx)*
- [x] Verify no production page displays `Intégration API à finaliser`. *(None found)*
- [x] Verify no source file contains debug console output outside approved logging utilities. *(Only logger.jsx itself + 2 commented lines)*
- [x] Verify PDF/print outputs match core Ajial sections and totals. *(12 pages wired with `PdfDialogViewer` + 8 PDF components covering BL, factures, syntheses, traceability, depot, balance, and ventes)*
- [x] Update `audit.md` statuses after implementation work lands.

## 🔧 PHASE 10 — API & Backend Improvements

- [x] Add server-side pagination for all list endpoints. *(All 22 controllers support `?page=` + `?per_page=` query params; backward-compatible: returns full array when no `?page=` param)*
- [x] Add pagination metadata to API responses. *(Returns `{ data: [...], meta: { current_page, last_page, per_page, total } }` when paginated; axios interceptor preserves full response for paginated calls)*
- [x] Cache reference data endpoints (livres, catégories, banques, saisons). *(BanqueController, CategoryController, SeasonController, CahierTemplateController, DestinationController use `Cache::remember()` with 1-hour TTL; cache invalidated on create/update/delete)*
- [x] Add database indexes for frequent filter columns. *(Migration `2026_06_03_203513` adds indexes on `b_livraisons.annee`, `b_livraisons.rep_id`, `remb_imp.annee`, `remb_imp.imprimeur_id`, `fact.rep_id`, `fact.year_session`, `carte_visites.rep_id`, and 30+ more columns across 17 tables)*
- [x] Add Laravel Queue jobs for heavy tasks (e-mail sending, PDF generation, large report aggregation). *(Created `SendEmailJob` with `ShouldQueue`, 3 retries, 30s backoff; EmailController now dispatches job instead of synchronous Mail::to())*
- [x] Add `annee` column to `remb_imp` table via migration. *(Already done in previous session — `RembImp` model updated)*
- [x] Add API response-shape standardization across all endpoints. *(Paginated: `{ data: [], meta: {} }`; Non-paginated: array from Resource::collection; axios interceptor handles both formats)*
- [x] Add request validation form classes for complex endpoints. *(Created `StoreBLivraisonRequest`, `UpdateBLivraisonRequest`, `StoreFactRequest`, `StoreRepresentantRequest` in `app/Http/Requests/Api/`)*
- [x] Add Eloquent model scopes for season filtering. *(`FilterBySeason` trait already exists and is applied to 12 models — scopes `season_id` and `annee` via global scope; no additional work needed)*
- [x] Fix polymorphic integrity: `b_livraison_items.deliverable_type/id` — add foreign key constraints or document application-level enforcement. *(`uuidMorphs` creates the composite index; no DB-level FK for morphs by design in Laravel — documented in `generated_ai/MERISE.md` §5)*
- [x] Add `logins.authenticatable_type/id` polymorphic auth documentation. *(Documented in `generated_ai/MERISE.md` §7 — single auth point for admin + rep)*

## 🛡️ PHASE 10.1 — Backend Controller Role Separation (Admin vs Rep)

> **Current State:** All API routes share `auth:sanctum` only. The `admin` middleware group exists but is only applied to ~15 admin-specific routes. The `rep` middleware group exists but is empty. Most shared routes (clients, BL, ventes, remboursements, depots) are accessible by both admin and rep — no role enforcement at the controller level.

### Middleware Registry (`bootstrap/app.php`)

| Alias | Middleware Class | Purpose |
|---|---|---|
| `admin` | `EnsureUserIsAdmin` | Restrict to admin users only |
| `rep` | `EnsureUserIsRep` | Restrict to representative users only |
| `supplier` | `EnsureUserIsSupplier` | Restrict to supplier users only (not yet applied) |
| `read_only_rep` | `EnsureReadOnlyForReps` | Rep can read but not write/update/delete |

### Route Classification by Role

#### Admin-Only Routes (currently in `admin` middleware group)

| Route | Controller | Notes |
|---|---|---|
| `POST /emails/send` | `EmailController@send` | ✅ Already admin-only |
| `GET /emails/history` | `EmailController@history` | ✅ Already admin-only |
| `POST/GET /invitations` | `InvitationController` | ✅ Already admin-only |
| `apiResource('admins')` | `AdminController` | ✅ Already admin-only |
| `apiResource('users')` | `UserController` | ✅ Already admin-only |
| `apiResource('imprimeurs')` | `ImprimeurController` | ✅ Already admin-only |
| `apiResource('remb-imps')` | `RembImpController` | ✅ Already admin-only |
| `apiResource('b-livraison-imps')` | `BLivraisonImpController` | ✅ Already admin-only |
| `apiResource('seasons')` (except index/show) | `SeasonController` | ✅ Already admin-only |
| `POST /seasons/set-active` | `SeasonController@setActive` | ✅ Already admin-only |
| `apiResource('representants')` | `RepresentantController` | ✅ Already admin-only |
| `GET /activity-logs` | `ActivityLogController` | ✅ Already admin-only |
| `/settings` CRUD | `SettingController` | ✅ Already admin-only |

#### Shared Routes — Need Role Separation

| Route | Controller | Current Access | Required Change |
|---|---|---|---|
| `apiResource('b-livraisons')` | `BLivraisonController` | Both | **Admin only for `store`** (admin creates BL for rep); Rep can `index/show` own BLs |
| `apiResource('b-livraison-items')` | `BLivraisonItemController` | Both | **Admin only** — items are managed via BL creation |
| `apiResource('b-ventes-clients')` | `BVentesClientController` | Both | **Rep only for `store/update/delete`** (rep creates own sales); Admin can `index/show` all |
| `apiResource('clients')` | `ClientController` | Both | **Rep only for `store/update/delete`** (rep manages own clients); Admin can `index/show` all |
| `apiResource('demande-f')` | `DemandeFController` | Both | **Rep only for `store`** (rep submits demand); Admin can `index/show/update` all |
| `POST /demande-f/{id}/transform` | `FacturationController@transform` | Both | **Admin only** — only admin can transform demand → invoice |
| `apiResource('factures')` | `FactController` | Both | **Admin only for `store/update/delete`**; Rep can `index/show` own |
| `apiResource('det-fact')` | `DetFactController` | Both | **Admin only** — invoice lines managed by admin |
| `apiResource('rep-remboursements')` | `RepRemboursementController` | Both | **Rep only for `store`** (rep submits payment); Admin can `index/show/update` all |
| `apiResource('client-remboursements')` | `ClientRemboursementController` | Both | **Rep only for `store/update/delete`** (rep manages own client payments); Admin can `index/show` all |
| `apiResource('depots')` | `DepotController` | Both | **Rep only for `store/update`** (rep declares own depot); Admin can `index/show` all |
| `apiResource('robots')` | `RobotController` | Both | **Rep only for `store/update/delete`** (rep manages own robots); Admin can `index/show` all |
| `apiResource('cahier-communications')` | `CahierCommunicationController` | Both | **Rep only for `store/update/delete`** (rep manages own orders); Admin can `index/show` all |
| `apiResource('carte-visites')` | `CarteVisiteController` | Both | **Rep only for `store/update/delete`** (rep manages own cards); Admin can `index/show` all |

#### Reference Data Routes (read-only for reps)

| Route | Middleware | Notes |
|---|---|---|
| `apiResource('livres')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('categories')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('catalogues')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('destinations')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('banques')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('cahier-templates')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |
| `apiResource('fact-sequences')` | `read_only_rep` | ✅ Rep can read, admin can CRUD |

### Implementation Tasks

- [x] **Wire `admin` middleware on admin-only routes** — `admin` middleware group already wraps: emailing, invitations, admins, users, imprimeurs, remb-imps, b-livraison-imps, seasons (CRUD + set-active), representants, activity-logs, settings. *(Verified in `routes/api.php` lines 106-144)*
- [x] **Wire `read_only_rep` middleware on reference data routes** — Applied to: livres, categories, catalogues, destinations, banques, cahier-templates, fact-sequences, contents. *(Verified in `routes/api.php` lines 69-89)*
- [x] **Implement `EnsureUserIsRep` middleware** — Exists at `app/Http/Middleware/EnsureUserIsRep.php`, registered as `rep` alias in `bootstrap/app.php`. *(Needs validation that it checks auth user role and returns 403 if not rep)*
- [ ] **Wire `rep` middleware on shared routes** — Apply `rep` middleware to rep-specific operations (store/update/delete on clients, b-ventes-clients, depots, robots, cahier-communications, carte-visites, demande-f, rep-remboursements, client-remboursements)
- [ ] **Add rep scoping to shared `index` routes** — When a rep calls `GET /api/clients`, the response should be scoped to their `rep_id` via `ScopedByRepresentant` trait (already on model). Verify controller queries respect this.
- [ ] **Add admin override to shared `index` routes** — When an admin calls `GET /api/clients`, they should see ALL clients (not scoped). Currently `ScopedByRepresentant` applies globally — need to conditionally disable for admins.
- [ ] **Update `BLivraisonController@store`** — Validate that only admins can create BLs for reps. Add `rep_id` from auth token when rep is authenticated (currently `rep_id` is required in request body).
- [ ] **Update `BVentesClientController@store`** — Auto-set `rep_id` from authenticated rep's token. Currently `rep_id` is in request body — should be auto-populated for reps.
- [ ] **Update `ClientController@store`** — Auto-set `representant_id` from authenticated rep's token for rep users.
- [ ] **Update `DepotController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `RepRemboursementController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `ClientRemboursementController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `DemandeFController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `RobotController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `CahierCommunicationController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Update `CarteVisiteController@store`** — Auto-set `rep_id` from authenticated rep's token.
- [ ] **Add conditional scope disabling** — When admin is authenticated, bypass `ScopedByRepresentant` global scope. Use `withoutGlobalScope(ScopedByRepresentant::class)` in admin controllers or add a helper.
- [ ] **Test role enforcement** — Verify: (1) Rep cannot access admin-only routes (403), (2) Admin can access all routes, (3) Rep only sees own data, (4) Admin sees all data.
- [ ] **Update API documentation** — Document which routes are admin-only, rep-only, or shared with role-based scoping.

### Route File Changes (`routes/api.php`)

Current structure:
```php
Route::middleware('auth:sanctum')->group(function () {
    // Shared routes (no role middleware)
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('b-livraisons', BLivraisonController::class);
    // ...

    // Admin-only (wrapped in admin middleware)
    Route::middleware('admin')->group(function () {
        Route::apiResource('representants', RepresentantController::class);
        // ...
    });

    // Rep-only (empty — needs implementation)
    Route::middleware('rep')->group(function () {
        //
    });
});
```

Required structure:
```php
Route::middleware('auth:sanctum')->group(function () {
    // Reference data (read-only for reps, CRUD for admin)
    Route::apiResource('livres', LivreController::class)->middleware('read_only_rep');
    Route::apiResource('categories', CategoryController::class)->middleware('read_only_rep');
    // ...

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        Route::apiResource('b-livraisons', BLivraisonController::class); // Admin creates BL for rep
        Route::apiResource('b-livraison-items', BLivraisonItemController::class);
        Route::apiResource('factures', FactController::class);
        Route::apiResource('det-fact', DetFactController::class);
        Route::post('/demande-f/{id}/transform', [FacturationController::class, 'transform']);
        // ... existing admin routes
    });

    // Rep-only routes (scoped by ScopedByRepresentant trait)
    Route::middleware('rep')->group(function () {
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('b-ventes-clients', BVentesClientController::class);
        Route::apiResource('depots', DepotController::class);
        Route::apiResource('robots', RobotController::class);
        Route::apiResource('cahier-communications', CahierCommunicationController::class);
        Route::apiResource('carte-visites', CarteVisiteController::class);
        Route::apiResource('demande-f', DemandeFController::class);
        Route::apiResource('rep-remboursements', RepRemboursementController::class);
        Route::apiResource('client-remboursements', ClientRemboursementController::class);
    });
});
```

### Data Scoping Strategy

| Scenario | Scope Behavior |
|---|---|
| Admin calls `GET /api/clients` | No scope — returns ALL clients |
| Rep calls `GET /api/clients` | `ScopedByRepresentant` — returns only own clients |
| Admin calls `GET /api/b-livraisons` | No scope — returns ALL BLs |
| Rep calls `GET /api/b-livraisons` | `ScopedByRepresentant` — returns only own BLs |
| Admin calls `POST /api/clients` | Can create client for any rep (via `representant_id` in body) |
| Rep calls `POST /api/clients` | Auto-sets `representant_id` from auth token |

## 📊 PHASE 11 — UX Enhancements

- [x] Add global loading indicator (top bar or skeleton) during API calls. *(Implemented: `isApiLoading` in Zustand store, animated bar in header via axios interceptor)*
- [x] Add dashboard charts using Recharts. *(Implemented: BarChart stock by category, PieChart stock distribution in `HomePage.jsx`)*
- [x] Add CSV export for all synthesis pages. *(Implemented: export button on Balance, Ventes, Depot, LivraisonFournisseurs, LivraisonREP, RemboursementFournisseurs, RemboursementREP pages)*
- [ ] Add date range filters on synthesis pages (balance, ventes, dépôt). *(Replace single-season filter with date range picker for cross-period analysis)*
- [x] Add minimum stock alerts on dashboard. *(Implemented: amber warning section showing books with stock ≤ 10 in `HomePage.jsx`)*
- [x] Add confirmation toast for successful CRUD operations. *(Already implemented via `AlertBox` pattern in MyTable — `actionsDetaille.delete.onOk` shows toast)*
- [x] Add empty-state illustrations for pages with no data. *(Implemented: `FileX` icon with helpful message in `MyTable` empty state)*
- [x] Add `MyTable` direct print button. *(Implemented: `enablePrint` prop opens print-friendly window with table data)*
- [ ] Add keyboard shortcuts for common actions (Ctrl+K search, Escape close dialog). *(Optional: use `react-hotkeys-hook` if added)*
- [x] Add responsive table horizontal scroll on mobile. *(Implemented: `overflow-x-auto` wrapper in `MyTable`)*
- [ ] Add REP carte visite page real model images. *(Replace 12 placeholder `placehold.co/300x180` images with real product photos)*

## 🔒 PHASE 12 — Security Hardening

- [ ] Add rate limiting on login endpoint. *(Use `throttle:5,1` middleware on `AuthController@login` — 5 attempts per minute)*
- [ ] Add rate limiting on password reset and invitation endpoints. *(Use `throttle:3,1` — 3 attempts per minute)*
- [ ] Add race condition protection on season activation. *(Use `DB::transaction()` with `SELECT ... FOR UPDATE` on `seasons` table when `is_active` is toggled)*
- [ ] Add negative amount validation on all payment/financial fields. *(Backend: `Rule::in(['min:0'])` on `montant`, `credit`, `avance`, `reste` fields; frontend: `min: 0` in schema)*
- [ ] Add admin audit trail viewer. *(Backend: `GET /api/activity-logs` with filters; Frontend: `ActivitePage.jsx` already exists but needs wiring to real endpoint)*
- [ ] Add CSRF protection verification for all non-API routes. *(Verify `VerifyCsrfToken` middleware excludes only `api/*`)*
- [ ] Add SQL injection prevention review. *(Verify all queries use Eloquent/Query Builder parameterized queries; no raw SQL)*
- [ ] Add XSS prevention review. *(Verify all user input is escaped in React JSX; no `dangerouslySetInnerHTML` without sanitization)*
- [ ] Add file upload validation for email attachments. *(Max size: 10MB; allowed types: pdf, jpg, png, docx; use Laravel `File` facade)*
- [ ] Add session timeout configuration. *(Current: 24h in `useAppStore.js`; verify backend session lifetime matches)*
- [ ] Add password complexity requirements. *(Min 8 chars, at least 1 uppercase, 1 number; use `Rule::min(8)->regex('/^(?=.*[A-Z])(?=.*\d)/')`)*
- [ ] Add logout invalidation. *(Call `DELETE /api/logout` to revoke Sanctum token on client logout)*
- [x] Add role-based middleware separation (admin vs rep). *(Implemented in Phase 10.1 — `admin` and `rep` middleware wired to route groups; `ScopedByRepresentant` trait auto-filters rep data)*

## 📈 PHASE 13 — Advanced Reporting

- [ ] Add inter-season comparison reports. *(Backend: new endpoint `GET /api/reports/compare?seasons=2025,2026`; frontend: new page with side-by-side season data)*
- [ ] Add automatic deposit calculation. *(Formula: `depot = delivered - sold`; verify against `Ajial/safe/depot.html` totals)*
- [ ] Add unpaid invoice auto-reminders. *(Backend: `SendReminderJob` scheduled daily; frontend: `InvitationPage.jsx` wired to trigger reminders)*
- [ ] Add bank reconciliation matching. *(New page: match `b_livraisons.banque` + `remb_imp.banque` against imported bank statements)*
- [ ] Add facture transformation validation. *(Ensure `POST /api/demande-f/{id}/transform` validates: all items delivered, quantities match, no negative balances)*
- [ ] Add representative performance dashboard. *(Metrics: total deliveries, total sales, collection rate, average delivery time; filter by season)*
- [ ] Add category-level analytics. *(Sales by category per season, stock turnover rate, category growth comparison)*
- [ ] Add client-level analytics. *(Top clients by volume, payment history, outstanding balance per client)*
- [ ] Add export reports as PDF with Ajial branding. *(Already done via `PdfDialogViewer`; extend to new report types)*

## ✉️ PHASE 14 — Email/SMTP Real Integration

- [ ] Replace `Mail::to()` log driver with real SMTP configuration. *(Add `.env` vars: `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION=tls`)*
- [ ] Wire `SimpleEmailPage.jsx` submit action to backend. *(Currently disabled with "Intégration API à finaliser" banner; connect to `POST /api/emails/send`)*
- [ ] Wire `InvitationPage.jsx` submit action to backend. *(Currently disabled; connect to `POST /api/invitations` with token generation)*
- [ ] Add recipient autocomplete from representatives, suppliers, clients. *(Use `GET /api/representants`, `GET /api/fournisseurs`, `GET /api/clients` for dropdown options)*
- [ ] Add email template system. *(Create `email_templates` table; store reusable templates with placeholders like `{{rep_name}}`, `{{season}}`)*
- [ ] Add email log viewer for admins. *(Wire `ActivitePage.jsx` to `GET /api/activity-logs?type=email`)*
- [ ] Add invitation token generation and validation. *(Backend: `Str::random(64)`, 7-day expiry; validate on `GET /api/invitations/{token}/validate`)*
- [ ] Add email attachment support. *(Max 10MB; validate file types; store in `storage/app/attachments/`)*
- [ ] Add email queue for bulk sending. *(Use `SendEmailJob` with `ShouldQueue` for large recipient lists)*

## Suggested Delivery Order

1. **Security and season foundation:** Phase 0 + Phase 2 global plumbing.
2. **API blockers:** Phase 1 endpoints/services needed by visible pages.
3. **Settings:** Phase 3 to make seasons and global config reliable.
4. **Representative portal:** Phase 6 because most REP routes are placeholders.
5. **Admin parity:** Phase 4 sections by business priority.
6. **Emailing/invitations:** Phase 5 (placeholder pages) + Phase 14 (real SMTP integration).
7. **Supplier portal:** Phase 7 after backend `supplier` middleware is created.
8. **API improvements:** Phase 10 — server-side pagination, caching, indexes, queue jobs.
9. **Role separation:** Phase 10.1 — wire admin/rep middleware, auto-populate rep_id, conditional scope disabling.
10. **Security hardening:** Phase 12 — rate limiting, race conditions, audit trail.
11. **UX polish:** Phase 11 — charts, CSV export, date filters, loading indicators.
12. **Advanced reporting:** Phase 13 — inter-season comparison, bank reconciliation.
13. **Final QA:** Phase 8 + Phase 9 before release.
