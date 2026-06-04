<!-- markdownlint-disable MD024 -->

# Cahier des Charges

## Database Structure & Migration Logic

### 🔐 high

- [x] **Fix dangerous CASCADE delete rules**: Change `depots.livre_id`, `clients.representant_id`, `b_ventes_clients.client_id`, `client_remboursements.client_id`, `depots.rep_id` from CASCADE to SET NULL. Change all 7 remaining `rep_id` FKs (b_livraisons, b_ventes_clients, client_remboursements, rep_remboursements, carte_visites, cahier_communication, robots) from CASCADE to SET NULL. Prevents accidental destruction of financial/stock history.
- [x] **Fix Depot model trait mismatch**: Change `Depot.php` from `HasUlids` to `HasUuids` to match all other 31 models and the migration schema.
- [x] **Add season_id to remb_imp table**: Create migration to add `season_id` FK column to `remb_imp` + add `FilterBySeason` trait to `RembImp` model. Currently the only payment table missing season scoping.
- [x] **Fix InvoiceObserver livree attribute**: Observer references `$fact->livree` but `livree` is on `DemandeF`, not `Fact`. Refactor observer to hook into `DemandeF` livree attribute so stock deduction actually triggers on delivery.
- [x] **Add unique constraints**: Add database-level unique constraints on `logins.username`, `fact.fact_number`, `b_livraisons.bl_number`, `b_livraison_imps.b_livraison_number` to prevent duplicate business identifiers.

### 🔐 medium

- [x] **Add missing belongsTo(Season) relationships**: Add `belongsTo(Season, 'season_id')` on: BLivraison, BLivraisonItem, BLivraisonImp, BVentesClient, ClientRemboursement, RepRemboursement, Fact, DetFact, CarteVisite, CahierCommunication, Depot. 12 models have the FK column but no Eloquent relationship.
- [x] **Add missing belongsTo(Destination) on Client**: Add `belongsTo(Destination, 'destination_id')` to Client model. FK column exists but no relationship defined.
- [x] **Add missing belongsTo(Destination) on Robot**: Add `belongsTo(Destination, 'destination_id')` to Robot model. FK column exists but no relationship defined.
- [x] **Add missing hasMany(RepRemboursement) on Fact**: Add inverse `hasMany(RepRemboursement, 'fact_id')` to Fact model. RepRemboursement.belongsTo(Fact) exists but inverse is missing.
- [x] **Add missing hasMany on Livre**: Add `hasMany(BLivraisonItem, 'livre_id')`, `hasMany(BVentesClient, 'livre_id')`, `hasMany(DetFact, 'livre_id')`, `hasMany(Depot, 'livre_id')` to Livre model.
- [x] **Add missing hasMany(RembImp) on Imprimeur**: Add `hasMany(RembImp, 'imprimeur_id')` to Imprimeur model. RembImp.belongsTo(Imprimeur) exists but inverse is missing.
- [x] **Remove redundant depot() on Representant**: Remove `depot()` hasOne relationship — `depots()` hasMany already covers both single and multi-depot access patterns.
- [x] **Remove password from representants table**: Create migration to drop `password` column from `representants` table. Remove password from `$fillable` in Representant model. Update `RepresentantController@store` to stop storing password in representants. Login model is the authenticatable — single source of truth for credentials.
- [x] **Remove hardcoded year_session default**: Create migration to change `fact.year_session` default from `'2026-2027'` to NULL. The API layer should set the real value from the active season.
- [x] **Fix migration rollback inconsistency**: Create migration to fix `down()` method in `2026_02_08_000002` to include `b_livraison_imps` in the rollback list.
- [x] **Add NOT NULL constraints with defaults**: Tighten critical business fields: `fact.total_ht` (default 0), `fact.total_ttc` (default 0), `b_livraisons.bl_number` (NOT NULL), `b_livraisons.date_emission` (NOT NULL), `client.raison_sociale` (NOT NULL).
- [x] **Add status workflow validation on b_livraisons**: Validate status transitions for `statut_recu`, `statut_vu`, `status` columns. Ensure valid state machine (e.g., can't go from 'livree' back to 'en_attente').
- [x] **Add status workflow validation on fact**: Validate `fact.status` transitions. Ensure valid invoice lifecycle (e.g., brouillon → envoyée → payée).
- [x] **Add status workflow validation on remb_imp**: Validate `remb_imp.statut_recu` and `statut_rejete` boolean transitions. Ensure valid payment status (e.g., en_attente → reçu/rejeté, can't be both).
- [x] **Add stock validation (prevent negative stock)**: Add validation in DepotController to check `quantite_balance >= quantite` before deducting stock. Prevent negative inventory.
- [x] **Add invoice amount validation**: Add server-side validation to ensure `fact.total_ht` matches sum of detail lines, and `total_ttc = total_ht * (1 + tva_rate / 100)`.

### 🔐 low

- [x] **Standardize pagination approach**: Remove hardcoded `paginate(1000)` fallbacks in DepotController, RepresentantController, UserController. Return all data as requested.

## API controller logic & Resource structure

### 🔐 high

- [x] **Fix dangerous CASCADE delete rules**: Change `depots.livre_id`, `clients.representant_id`, `b_ventes_clients.client_id`, `client_remboursements.client_id`, `depots.rep_id` from CASCADE to SET NULL. Change all 7 remaining `rep_id` FKs (b_livraisons, b_ventes_clients, client_remboursements, rep_remboursements, carte_visites, cahier_communication, robots) from CASCADE to SET NULL. Prevents accidental destruction of financial/stock history.
- [x] **Fix Depot model trait mismatch**: Change `Depot.php` from `HasUlids` to `HasUuids` to match all other 31 models and the migration schema.
- [x] **Add season_id to remb_imp table**: Create migration to add `season_id` FK column to `remb_imp` + add `FilterBySeason` trait to `RembImp` model. Currently the only payment table missing season scoping.
- [x] **Fix InvoiceObserver livree attribute**: Observer references `$fact->livree` but `livree` is on `DemandeF`, not `Fact`. Refactor observer to hook into `DemandeF` livree attribute so stock deduction actually triggers on delivery.
- [x] **Add unique constraints**: Add database-level unique constraints on `logins.username`, `fact.fact_number`, `b_livraisons.bl_number`, `b_livraison_imps.b_livraison_number` to prevent duplicate business identifiers.
- [x] **Rewrite all 27 API Resources with explicit whitelisting**: Replace pass-through Resources with explicit field selection to prevent password hash leaks and exposure of internal DB columns. Critical: RepresentantResource leaks `login.password` via eager-loaded relationship. UserResource may expose password column. All 22 pass-through Resources need field whitelisting.
- [x] **Create FormRequests for all controllers**: Wire up existing unused FormRequests (StoreBLivraisonRequest, UpdateBLivraisonRequest, StoreRepresentantRequest, StoreFactRequest) + create new FormRequest classes for remaining controllers that currently use inline validation. Provides consistent validation rules, custom error messages, and authorization.
- [x] **Fix AdminController@store dead code**: Lines 54-55 (`Admin::create`) are unreachable — always returns from catch block first. Restructure the try-catch logic.
- [x] **Add validation + authorization to FacturationController::transform**: No input validation on transform endpoint. Any authenticated user can transform any demande into an invoice. Add FormRequest validation.

### 🔐 medium

- [x] **Add missing belongsTo(Season) relationships**: Add `belongsTo(Season, 'season_id')` on: BLivraison, BLivraisonItem, BLivraisonImp, BVentesClient, ClientRemboursement, RepRemboursement, Fact, DetFact, CarteVisite, CahierCommunication, Depot. 12 models have the FK column but no Eloquent relationship.
- [x] **Add missing belongsTo(Destination) on Client**: Add `belongsTo(Destination, 'destination_id')` to Client model. FK column exists but no relationship defined.
- [x] **Add missing belongsTo(Destination) on Robot**: Add `belongsTo(Destination, 'destination_id')` to Robot model. FK column exists but no relationship defined.
- [x] **Add missing hasMany(RepRemboursement) on Fact**: Add inverse `hasMany(RepRemboursement, 'fact_id')` to Fact model. RepRemboursement.belongsTo(Fact) exists but inverse is missing.
- [x] **Add missing hasMany on Livre**: Add `hasMany(BLivraisonItem, 'livre_id')`, `hasMany(BVentesClient, 'livre_id')`, `hasMany(DetFact, 'livre_id')`, `hasMany(Depot, 'livre_id')` to Livre model.
- [x] **Add missing hasMany(RembImp) on Imprimeur**: Add `hasMany(RembImp, 'imprimeur_id')` to Imprimeur model. RembImp.belongsTo(Imprimeur) exists but inverse is missing.
- [x] **Remove redundant depot() on Representant**: Remove `depot()` hasOne relationship — `depots()` hasMany already covers both single and multi-depot access patterns.
- [x] **Remove password from representants table**: Create migration to drop `password` column from `representants` table. Remove password from `$fillable` in Representant model. Update `RepresentantController@store` to stop storing password in representants. Login model is the authenticatable — single source of truth for credentials.
- [x] **Remove hardcoded year_session default**: Create migration to change `fact.year_session` default from `'2026-2027'` to NULL. The API layer should set the real value from the active season.
- [x] **Fix migration rollback inconsistency**: Create migration to fix `down()` method in `2026_02_08_000002` to include `b_livraison_imps` in the rollback list.
- [x] **Add NOT NULL constraints with defaults**: Tighten critical business fields: `fact.total_ht` (default 0), `fact.total_ttc` (default 0), `b_livraisons.bl_number` (NOT NULL), `b_livraisons.date_emission` (NOT NULL), `client.raison_sociale` (NOT NULL).
- [x] **Add status workflow validation on b_livraisons**: Validate status transitions for `statut_recu`, `statut_vu`, `status` columns. Ensure valid state machine (e.g., can't go from 'livree' back to 'en_attente').
- [x] **Add status workflow validation on fact**: Validate `fact.status` transitions. Ensure valid invoice lifecycle (e.g., brouillon → envoyée → payée).
- [x] **Add status workflow validation on remb_imp**: Validate `remb_imp.statut_recu` and `statut_rejete` boolean transitions. Ensure valid payment status (e.g., en_attente → reçu/rejeté, can't be both).
- [x] **Add stock validation (prevent negative stock)**: Add validation in DepotController to check `quantite_balance >= quantite` before deducting stock. Prevent negative inventory.
- [x] **Add invoice amount validation**: Add server-side validation to ensure `fact.total_ht` matches sum of detail lines, and `total_ttc = total_ht * (1 + tva_rate / 100)`.
- [x] **Standardize delete responses to 204 No Content**: All delete endpoints should return 204 with empty body. Currently mix of 200+JSON message vs 204+null. Affects: BLivraisonController, BLivraisonImpController, CarteVisiteController, CahierCommunicationController, DemandeFController, and others.
- [x] **Standardize store responses to 201 Created**: All store() methods should return 201 Created instead of implicit 200. REST convention for resource creation.
- [x] **Remove duplicate route `remboursement-factures`**: Both `remboursement-factures` and `rep-remboursements` point to RepRemboursementController. Remove `remboursement-factures` to avoid API surface confusion.
- [x] **Fix broken show() chaining**: `CarteVisiteController:84` and `CahierCommunicationController:57` use `findOrFail($id)->where(...)` — `where` after findOrFail is redundant and won't filter. Remove the chained where.
- [x] **Fix non-paginated fallback inconsistency**: RobotController, RembImpController, ImprimeurController, DetFactController use `paginate(1000)` when no `?page` param — returns paginator object instead of collection. Remove pagination, return full collections.
- [x] **Rename BanqueRequest to BanqueResource + wire into controller**: BanqueRequest is misnamed (it's a Resource, not a Request). Rename and apply to BanqueController@index which currently returns raw collection.
- [x] **Fix CahierTemplateController@store Resource constructor**: Passes `new CahierTemplateResource($template, 201)` — 2nd param is $request, not status code. Fix to use proper 201 response.
- [x] **Create 5 missing API Resources**: Create SeasonResource, SettingResource, ActivityLogResource, EmailResource, InvitationResource. Currently these controllers return raw JSON without Resource wrapping.
- [x] **Fix AdminController@store unreachable code**: Restructure try-catch to ensure `Admin::create()` is actually reachable after validation.

### 🔐 low

- [ ] **Refactor ScopedByRepresentant trait**: Remove hardcoded `App\Models\BLivraison` import. Use dynamic class resolution (e.g., `get_class($this)`) to decouple trait from specific model.
- [ ] **Gate InvoiceObserver logging**: Replace `Log::info()` in InvoiceObserver loop with environment-gated logging to prevent excessive log volume in production.
- [x] **Standardize pagination approach**: Remove hardcoded `paginate(1000)` fallbacks in DepotController, RepresentantController, UserController. Return all data as requested.

### ⏭ SKIPPED

- [ ] **read_only_rep scope adjustment**: `read_only_rep` applied to 7 resources (livres, catalogues, categories, contents, destinations, fact-sequences, banques, cahier-templates). Some may need to move to admin-only. Deferred — requires business logic review of which resources should be admin-controlled vs rep-readable.
- [ ] **EnsureUserIsRep middleware**: Blocks anyone who isn't 'representant' — including admins. If rep-only routes are added in the future, admins would be blocked. Kept as-is — reps-only routes don't exist yet.
- [ ] **Login rate limiting**: LoginController@login has no rate limiting. Skipped — rate limiting handled at infrastructure level (nginx, cloudflare).
