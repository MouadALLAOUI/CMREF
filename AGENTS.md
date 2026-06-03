# CMREF — Agent Guide

- keep my code dna structure  dont change the flow and logic
- dont change the design and style
- if file content needed use /Ajial directory as a reference for the full file content, this is the static verion of the code base.
- don't add new packages or dependencies without explicit instructions.
- if you need to fix a bug or an issue, keep the fix minimal and only address
- proiritize existing components and utilities over creating new ones, unless there's a clear gap that needs to be filled.

## GIT workflow

- if i asked you to push a PR, run this prompt `.agents\skills\git-workflow-agent\git-workflow-agent.md`

## Repo structure

Two independent projects side by side — NOT a monorepo workspace.

| Path | Stack | Entry |
|---|---|---|
| `biblio/` | React 19 (CRA 5), Zustand 5, Radix UI, Tailwind 3 | `src/App.js` → `routes/routes.jsx` |
| `nexgen-lms/` | Laravel 12, Sanctum, Spatie activitylog | `routes/api.php` (all API routes) |

## Commands

**Frontend** (run from `biblio/`):

- `npm start` — dev server on `localhost:3000`
- `npm run build` — production build to `build/`
- `npm test` — CRA test runner (jest, react-testing-library)
- `npm run lint` — eslint `src/**/*.{js,jsx}`
- `npm run lint:console` — eslint with `no-console` rule (allows `warn`/`error`)

**Backend** (run from `nexgen-lms/`):

- `php artisan serve` — dev server
- `php artisan migrate` — run migrations (UUID pk convention)
- `php artisan make:model -m` — new model + migration

## Key conventions

### Frontend

- **State**: Zustand store at `store/useAppStore.js`, persisted to `sessionStorage` (key `app-storage`). Auth expires after 24h.
- **API client**: `api/axios.js` — auto-attaches Bearer token, CSRF cookie fetched before login. Response interceptor unwraps: `response.data?.data || response.data || []`.
- **Services**: 30 CRUD services in `api/services/`, each follows: `getAll(params)`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`.
- **Logger**: `lib/logger.jsx` — only emits when `REACT_APP_ENV === "Development"`, no-ops in production. Use `logger(msg, "error")()` NOT bare `console.*`.
- **UI patterns**:
  - `MyTable` (`components/ui/myTable.jsx`) — universal table with pagination, search, sort, categorical filter, row selection, nested columns, math expressions in accessors. Page auto-resets when current > total.
  - `UniversalDialog` (`components/template/dialog/UniversalDialog.jsx`) — schema-driven CRUD modal using `buildSchemaFromControllerRules`.
- **Routing** (`routes/routes.jsx:65-68`):
  - Admin: `/dash/{section}/{action}` — lowercase with underscores
  - REP: `/REP/dash/{section}/{action}` — uppercase `REP`, then lowercase
- **ESLint**: `no-console` is ERROR (allow `warn`, `error`). `console.log` will break CI.
- **Env**: `REACT_APP_API_URL=http://localhost:8000/api`, `REACT_APP_ENV=Development`

### Backend

- **Models**: UUID primary keys (`HasUuids` trait, `$incrementing = false`, `$keyType = 'string'`). All timestamps.
- **Routes**: Kebab-case resource names (`b-livraisons`, `rep-remboursements`). All protected by `auth:sanctum` group.
- **Settings**: Generic key-value store at `GET/PUT /api/settings` and `GET/POST /api/settings/{key}`. Convention: `pied_de_facture.{field}`.
- **Auth middleware**: `EnsureUserIsAdmin` (alias `admin`) exists but NOT applied to routes. No `rep`/`supplier` middleware yet — all routes share `auth:sanctum`.
- **CSRF**: Excluded for all `api/*` routes.

## Pages with mock / placeholder data

- `SimpleEmailPage`, `InvitationPage`, `PiedDeFacturePage` — amber "Intégration API à finaliser" banners, buttons disabled
- REP sub-routes in `routes.jsx`: `bl/*`, `factures/*`, `clients/*`, `depot`, `cahier_texte/*`, `cartes_visits/*`, `robots`, `profil` — all `<div>` placeholders

## Known technical debt

- **9 hardcoded `annee: "2627"`** in `LoginForm.jsx`, `LivresPage.jsx`, `SaisirBlPage.jsx`, `ReprésentantSaisirBl.jsx` — need active season from store (PHASE 2)
- **Bare `console.error`**: `useStockReport.js:28`, `Fournisseurs/Remboursement/Remboursement.jsx:77`
- **`rembFactureService.js`**: import path was `'../api/axios'` (broken; fixed to `'../axios'`)
- **`RemboursementFacturesPage.jsx`**: orphaned page (not imported in routes)
- **`cahier-communications`** (backend) ≠ **`cahier-templates`** (frontend) — different concepts, both now have endpoints
