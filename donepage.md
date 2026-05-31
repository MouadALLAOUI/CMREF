# CMREF Task List

## 🔐 PHASE 0 — Foundation & Auth
- [x] Add `ProtectedRoute` guard to `/REP/dash/*` routes (currently unprotected)
- [x] Add season context/global store so active season is available app-wide
- [x] Create `utils/helpers.js` DRY organizer file (shared fetch, format, toast patterns)
- [x] Remove all `console.log` debug statements from auth and logout flows
- [x] Fix `MyTable` pagination bug — reset to page 1 when current page becomes empty after delete
- [x] Add `// MOCK — replace with API` comments to all pages still using hardcoded data

## admin
- [ ] Representants_disponibles -> add last online status red if offline green online
- [ ] Representants_disponibles -> show password in modify (not the best for security), in modify pass can be null
- [ ] for Bl detail modify ask if keep only qte change or the full elements
- [ ] representant/Remboursement need to sync with the original ajial page
- [ ] representant/Declaration_Depot need another part "liste des dépôts représentants"
- [ ] representant/Synthese_Remboursement complet to match
- [ ] emailing
// not complet match
- [ ] representant/Demande_facturation
- [ ] representant/Factures
- [ ] representant/Remboursement_Factures
- [ ] representant/Cahier_texte
- [ ] representant/Cartes_Visite
- [ ] representant/Synthese_BL
- [ ] tracabilite/*
- [ ] syntheses_globales/*
- [ ] reglages/Season_travail
- [ ] reglages/Modeles_Cahier_texte