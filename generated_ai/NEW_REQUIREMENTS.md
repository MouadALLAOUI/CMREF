# Nouvelles Exigences Client — Réunion du 25/06/2026

> Document généré le 25/06/2026 suite à la réunion client.

---

## Table des modifications

| # | Modification | Page(s) concernée(s) | Priorité |
|---|---|---|---|
| 1 | "À l'ordre de" lié à la liste des fournisseurs | `/dash/representant/remboursement` | Haute |
| 2 | Nouveau champ "mandataire" (nom/main/man) | `/dash/fournisseurs/remboursement` | Haute |
| 3 | Champ "retour de chèque" | `/dash/representant/remboursement` + `/REP/dash/bl/remb` | Haute |
| 4 | Mise à jour globale BL + CRUD par item | `/dash/representant/saisir_un_bl` | Haute |
| 5 | Image du chèque (upload + affichage) | `/dash/representant/remboursement` + `/dash/fournisseurs/remboursement` | Moyenne |
| 6 | Téléchargement facture en DOCX + impression | Pages facture | Moyenne |
| 7 | Déclaration dépôt par le REP uniquement | `/dash/representant/declaration_depot` + `/REP/dash/depot` | Haute |
| 8 | Sélection multi-saison | Toute l'application (filtre saison) | Haute |
| 9 | Saison lock/unlock/disable sur représentants | `/dash/representant/representants_disponibles` | Haute |

---

- [x] Modification 1
- [x] Modification 2
- [x] Modification 3
- [x] Modification 4
- [x] Modification 5
- [x] Modification 6
- [ ] Modification 7
- [ ] Modification 8
- [x] Modification 9

---

## Modification 1 — "À l'ordre de" lié à la liste des fournisseurs

### Contexte actuel

Dans `ReprésentantRemboursement.jsx:138`, le champ `imp` ("A l'ordre de") est un select codé en dur avec 4 valeurs : `Wataniya, MSM-media, Commun, Autre` (lignes 184-189).

### Comportement attendu

Le champ "À l'ordre de" doit être hybride :

- **"MSM-media"** reste une option statique (pour l'admin)
- **Tous les autres** (Wataniya, Commun, Autre) sont remplacés par la **liste dynamique des fournisseurs** (`Imprimeur`)
- Le champ doit être **réellement lié** à la table `imprimeurs` via une FK, pas juste un string

Architecture :

- `imp` (string) gardé pour l'affichage / valeur textuelle
- `a_lordre_de_id` (FK nullable → `imprimeurs.id`) ajouté pour le lien réel
- Quand on sélectionne un fournisseur → `a_lordre_de_id = imprimeur.id`, `imp = imprimeur.raison_sociale`
- Quand on sélectionne "MSM-media" → `a_lordre_de_id = null`, `imp = 'MSM-media'`

### Plan d'implémentation

**Backend :**

1. **Migration** : Ajouter la colonne FK dans la migration existante `2026_02_07_182105_create_rep_remboursements_table.php` :
   - Ajouter après `$table->string('cheque_image_path')->nullable();` (ligne 24) :

   ```php
   $table->foreignUuid('a_lordre_de_id')->nullable()->index();
   $table->foreign('a_lordre_de_id')->references('id')->on('imprimeurs')->nullOnDelete();
   ```

   Pas de nouvelle migration — le `migrate:fresh` recréera la table proprement.

2. **Model `RepRemboursement.php`** :
   - Ajouter `'a_lordre_de_id'` au `$fillable`.
   - Ajouter la relation :

     ```php
     public function aLordreDe()
     {
         return $this->belongsTo(Imprimeur::class, 'a_lordre_de_id');
     }
     ```

3. **Controller `RepRemboursementController`** :
   - Validation :

     ```php
     'imp' => 'nullable|string|max:255',
     'a_lordre_de_id' => 'nullable|uuid|exists:imprimeurs,id',
     ```

   - Dans `index`, eager-loader la relation : `->with(['representant', 'banque', 'facture', 'aLordreDe'])`.

4. **Resource** (si `RepRemboursementResource` existe) :
   - Ajouter `'a_lordre_de_id' => $this->a_lordre_de_id` et l'objet `aLordreDe` imbriqué.

**Frontend (`ReprésentantRemboursement.jsx`) :**

1. **State & formData** :
   - Ajouter `a_lordre_de_id: ""` au `formData`.
   - Garder `imp` inchangé.

2. **Schema (rules)** :
   - Ajouter `a_lordre_de_id: "nullable|uuid|exists:imprimeurs,id"`.
   - `imp` reste `nullable|string|max:255` (plus de `in:...`).

3. **Select dynamique combiné** :
   Remplacer `selectItems.imp` par un select unique qui gère les deux cas :

   ```js
   a_lordre_de_id: [
     { label: "MSM-media", value: "__msm_media__" },
     { label: "--- Fournisseurs ---", value: "", disabled: true },
     ...imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id })),
   ]
   ```

   Ou mieux : créer un seul select nommé `a_lordre_de_id` avec "MSM-media" comme valeur sentinelle et les IDs des imprimeurs.

4. **Gestion de la sélection** (via `onChange` ou `overrides`) :

   ```js
   overrides: {
     a_lordre_de_id: {
       onChange: (val) => {
         if (val === "__msm_media__") {
           setFormData(prev => ({ ...prev, a_lordre_de_id: null, imp: "MSM-media" }));
         } else {
           const imprimeur = imprimeurs.find(i => i.id === val);
           setFormData(prev => ({ ...prev, a_lordre_de_id: val, imp: imprimeur?.raison_sociale || "" }));
         }
       },
     },
   },
   ```

5. **Labels** :
   - `a_lordre_de_id: "À l'ordre de"` (remplace le label `imp`).
   - Optionnel : cacher `imp` du formulaire (`exclude: ["imp"]` ou ne pas l'ajouter à la schema).

6. **Colonne tableau** :
   - Remplacer `{ header: "A l'ordre de", accessor: "imp" }` par un accesseur qui prend `a_lordre_de_id` en priorité :

     ```js
     { header: "A l'ordre de", accessor: "a_ordre_de.raison_sociale || imp" }
     ```

7. **Fetch** : Ajouter `imprimeurService.getAll()` dans le `Promise.all` du `fetchData()`.

**Fichiers impactés :**

- `nexgen-lms/database/migrations/xxxx_add_a_lordre_de_id_to_rep_remboursements.php` (nouveau)
- `nexgen-lms/app/Models/RepRemboursement.php`
- `nexgen-lms/app/Http/Controllers/Api/RepRemboursementController.php`
- `biblio/src/pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement.jsx`

---

## Modification 2 — Nouveau champ "rep_id" (FK → représentant) sur fournisseurs/remboursement

### Contexte actuel

Le formulaire de `Remboursement.jsx` (Fournisseurs) a les champs : `imprimeur_id`, `date_payment`, `banque_id`, `cheque_number`, `montant`, `annee`. Pas de lien avec le REP qui est à l'origine du remboursement.

### Comportement attendu

Un REP créé un remboursement "à l'ordre de" un fournisseur (Modif 1). Dans la page fournisseurs/remboursement (admin), on doit voir **quel REP** est associé à chaque remboursement fournisseur.

Ajouter `rep_id` (FK → `representants.id`) pour lier chaque `RembImp` au représentant qui l'a initié.

### Plan d'implémentation

**Backend :**

1. **Migration** : Ajouter la FK dans la migration existante `2026_02_07_172708_create_remb_imps_table.php` :
   - Ajouter après `$table->string('cheque_image_path')->nullable();` (ligne 22) :

   ```php
   $table->foreignUuid('rep_id')->nullable()->index();
   $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
   ```

2. Ajouter `'rep_id'` au `$fillable` de `RembImp.php`.
3. Ajouter la relation :

   ```php
   public function representant()
   {
       return $this->belongsTo(Representant::class, 'rep_id');
   }
   ```

4. Validation : `'rep_id' => 'nullable|uuid|exists:representants,id'` dans `RembImpController.php` (store + update).
5. Eager-load `representant` dans `RembImpController@index` pour l'afficher dans le tableau.

**Frontend (`Remboursement.jsx`) :**

1. Ajouter `rep_id: ""` au `formData`.
2. Ajouter aux `REMB_IMP_RULES` : `rep_id: 'nullable|uuid|exists:representants,id'`.
3. Ajouter aux `REMB_IMP_LABELS` : `rep_id: "Représentant"`.
4. Ajouter `rep_id` aux `selectItems` :

   ```js
   rep_id: representants.map(r => ({ label: r.nom, value: r.id })),
   ```

5. Ajouter une colonne au tableau :

   ```js
   { header: "Représentant", accessor: "representant.nom" },
   ```

6. Ajouter `representantService.getAll()` au fetchData existant.
7. Ajouter `representant` dans les handlers `handleAction` et `handleReset`.

**Fichiers impactés :**

- `nexgen-lms/app/Models/RembImp.php`
- `nexgen-lms/app/Http/Controllers/Api/RembImpController.php`
- `nexgen-lms/database/migrations/2026_02_07_172708_create_remb_imps_table.php`
- `nexgen-lms/app/Http/Resources/RembImpResource.php` (si existe)
- `biblio/src/pages/Fournisseurs/Remboursement/Remboursement.jsx`

---

## Modification 3 — Champ "retour de chèque" sur Fournisseurs/Remboursement

### Contexte actuel

`RembImp` a les statuts : `statut_recu`, `statut_rejete`. Aucun champ pour le retour de chèque par le fournisseur.

### Flux métier

1. **Admin** créé un `RembImp` (paiement fournisseur), lié à un REP via `rep_id` (Modif 2)
2. Le **fournisseur** peut retourner le chèque (impayé, rejeté, compte clos, etc.)
3. **L'admin** marque le retour sur la page **Fournisseurs/Remboursement** avec date + motif
4. **Le REP** voit sur `RepRembBLPage.jsx` (via le lien REP → RembImp) que son chèque a été retourné (lecture seule)

### Comportement attendu

Ajouter sur `RembImp` :

- `statut_retourne` (booléen) — le fournisseur a retourné le chèque
- `date_retour` (date) — quand il a été retourné
- `motif_retour` (string) — pourquoi (ex: "impayé", "refusé", "compte clos", etc.)

### Plan d'implémentation

**Backend :**

1. **Migration** : Ajouter les champs dans la migration existante `2026_02_07_172708_create_remb_imps_table.php` :
   - Ajouter après `$table->boolean('statut_rejete')->default(false);` (ligne 25) :

   ```php
   $table->boolean('statut_retourne')->default(false);
   $table->date('date_retour')->nullable();
   $table->string('motif_retour', 500)->nullable();
   ```

2. Ajouter les champs au `$fillable` de `RembImp.php`.
3. Validation : `'statut_retourne' => 'boolean'`, `'date_retour' => 'nullable|date'`, `'motif_retour' => 'nullable|string|max:500'`.

**Frontend — Admin (`Remboursement.jsx` — Fournisseurs) :**

1. Ajouter `statut_retourne: false`, `date_retour: ""`, `motif_retour: ""` au `formData`.
2. Ajouter les règles au `REMB_IMP_RULES`.
3. Ajouter les colonnes au tableau :
   - `statut_retourne` : booléen avec toggle
   - `date_retour` : date
4. Labels : `"Retourné"`, `"Date de retour"`, `"Motif de retour"`.
5. Pour `motif_retour`, utiliser `overrides: { motif_retour: { inputType: "textarea" } }`.
6. Handle toggle pour `statut_retourne` (comme les handlers `handleUpdateStatusRecuRemb` / `handleUpdateStatusRejeteRemb` existants).

**Frontend — Admin (`ReprésentantRemboursement.jsx`) :**

1. Ajouter une colonne "Retourné" en lecture seule (affichage uniquement) pour que l'admin voie que le fournisseur a retourné le chèque lié à ce RepRemb.
2. Affichage : badge rouge "Retourné" + infobulle (date + motif).
3. Pas de toggle — le retour est géré sur la page Fournisseurs/Remboursement.

**Frontend — REP (`RepRembBLPage.jsx`) :**

1. Ajouter une colonne "Retourné" en lecture seule.
2. Même affichage : badge rouge + infobulle.

**Fichiers impactés :**

- `nexgen-lms/app/Models/RembImp.php`
- `nexgen-lms/app/Http/Controllers/Api/RembImpController.php`
- `nexgen-lms/database/migrations/2026_02_07_172708_create_remb_imps_table.php`
- `nexgen-lms/app/Http/Resources/RembImpResource.php`
- `biblio/src/pages/Fournisseurs/Remboursement/Remboursement.jsx`
- `biblio/src/pages/REP/BL/RepRembBLPage.jsx` (si liaison avec RembImp)

---

## Modification 4 — Mise à jour globale BL + CRUD par item

### Contexte actuel

`ReprésentantSaisirBl.jsx` :

- Création de BL via un formulaire avec `book_accordion` (groupes de livres par catégorie).
- Détail du BL dans une section séparée (`#bl-details-section`) avec sous-tableau des items.
- CRUD items : édition inline de quantité (via `FormInputRow` dans dialog d'edit) et suppression.
- Pas d'ajout de nouveau livre à un BL existant.

### Comportement attendu

1. **Mise à jour globale du BL** : Permettre de modifier les champs principaux du BL (date, type, mode d'envoi, etc.) après création (pas seulement les items).
2. **Ajout d'items à un BL existant** : Dans la section détail, ajouter un bouton "Ajouter un livre" qui ouvre un sélecteur de livre + champ quantité.
3. **CRUD complet par item** : Au minimum — ajouter, modifier quantité, supprimer. Idéalement avec undo/confirmation.

### Plan d'implémentation

**Backend :**

1. S'assurer que `BLivraisonController@update` accepte les champs principaux du BL.
2. Ajouter une route/endpoint pour ajouter un item à un BL existant (POST `/api/b-livraison-items` avec `deliverable_id`). Vérifier que c'est déjà possible via le controller existant.
3. `BLivraisonItemController@create` devrait déjà gérer l'ajout — vérifier la validation.

**Frontend (`ReprésentantSaisirBl.jsx`) :**

1. **Modification globale du BL** : Dans la section détail du BL, ajouter un bouton "Modifier le BL" qui ouvre un UniversalDialog pré-rempli avec les champs du BL (date_emission, type, mode_envoi, bl_number). Au submit, appeler `bLivraisonService.update(row.id, formData)`.
2. **Ajout d'item** : Ajouter un bouton "+ Ajouter un livre" dans l'en-tête de la section détail. Au clic, afficher un sélecteur (select ou recherche) de livres + champ quantité + bouton valider. Appeler `bLivraisonItemService.create({ deliverable_id: blId, deliverable_type: "App\\Models\\BLivraison", livre_id, quantite })`.
3. **CRUD existant** : L'édition et suppression inline sont déjà implémentés via `actionsDetaille`. S'assurer que tout fonctionne.
4. Permettre la modification du `statut_vu` et `statut_recu` directement dans le tableau principal (ou via colonne booléenne toggle).

**Fichiers impactés :**

- `biblio/src/pages/Représentant/ReprésentantSaisirBl/ReprésentantSaisirBl.jsx`
- `nexgen-lms/app/Http/Controllers/Api/BLivraisonController.php` (vérification)
- `nexgen-lms/app/Http/Controllers/Api/BLivraisonItemController.php` (vérification)

---

## Modification 5 — Image du chèque (upload + affichage)

### Contexte actuel

Les modèles `RepRemboursement` et `RembImp` ont déjà :

- Un champ `cheque_image_path` (string) dans le `$fillable`.
- Un accesseur `getChequeUrlAttribute()` qui retourne l'URL complète.
- Une colonne dans le formData `cheque_image_path` (actuellement un champ texte simple).

Cependant, le frontend :

- Traite `cheque_image_path` comme un simple champ texte (`nullable|string`) — **pas d'upload de fichier**.
- N'affiche pas l'image dans la vue "view".

### Comportement attendu

1. **Upload d'image** : Le champ "Image du chèque" doit être un upload de fichier (drag & drop ou file picker), pas un champ texte.
2. **Affichage** : Dans le mode "view" du dialog, afficher l'image du chèque (si présente).
3. **Doit fonctionner pour les deux pages** : RepRemboursement et FournisseurRemboursement.

### Plan d'implémentation

**Backend :**

1. Ajouter une route POST `/api/upload-cheque` qui :
   - Accepte un fichier image (jpg, png, pdf).
   - Stocke dans `storage/app/public/cheques/`.
   - Retourne le `path` relatif (ex: `cheques/xxx.jpg`) ou l'URL complète.
   - (Optionnel) Comprimer/redimensionner l'image.
2. Ajouter une règle de validation `'cheque_image' => 'nullable|image|mimes:jpg,jpeg,png,pdf|max:2048'`.
3. Option alternative : Utiliser un upload direct dans le controller `RepRemboursementController@store` / `@update` (via `$request->file('cheque_image')`).

**Frontend :**

1. **Composant d'upload réutilisable** : Créer ou adapter un composant `FileUpload` (ou configurer un champ de type `file` dans `UniversalDialog`/`buildSchemaFromControllerRules`).
   - Alternative plus rapide : Ajouter un champ personnalisé dans le schema via `overrides` avec un rendu custom (`render: () => <input type="file" ... />`).
2. **Page RepRemboursement** :
   - Dans le formulaire, remplacer `cheque_image_path: "nullable|string"` par un upload d'image.
   - Le schéma doit afficher un aperçu si une image existe déjà.
   - Dans le mode "view", afficher `<img src={cheque_url} />`.
3. **Page FournisseurRemboursement** :
   - Même logique (upload + preview).
4. **Appel API** : Lors de la création/modification, utiliser `FormData` pour envoyer le fichier + les autres champs.
   - Modifier le service (axios) pour supporter `Content-Type: multipart/form-data` quand un fichier est présent.

**Fichiers impactés :**

- `biblio/src/pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement.jsx`
- `biblio/src/pages/Fournisseurs/Remboursement/Remboursement.jsx`
- `biblio/src/api/services/repRemboursementService.js`
- `biblio/src/api/services/rembImpService.js`
- `biblio/src/components/template/dialog/UniversalDialog.jsx` (si ajout type file)
- `nexgen-lms/routes/api.php` (nouvelle route upload)
- `nexgen-lms/app/Http/Controllers/Api/UploadController.php` (nouveau controller)

---

## Modification 6 — Téléchargement facture en DOCX + impression

### Contexte actuel

Il existe des PDFs pour les BL (via `PdfDialogViewer` + `SingleRepBlPdf`). Pas de DOCX, pas de système de génération DOCX.

### Comportement attendu

1. **Téléchargement DOCX** : Un bouton "Télécharger en DOCX" sur les pages de facture (ex: `/dash/fournisseurs/synthese_remboursement`, `/dash/representant/synthese_remboursement`).
2. **Impression** : Un bouton "Imprimer" (peut être une impression navigateur standard `window.print()` ou un format PDF printable).

### Plan d'implémentation

**Architecture : 100% frontend — aucune modification backend.**

Pas de contrôleur PHP, pas de route API, pas d'installation de package côté serveur (PhpWord supprimé du plan). La génération du fichier DOCX se fait entièrement dans le navigateur via le package npm `docx`.

**Pattern — Composants template DOCX (miroir des PDFs) :**

Les PDFs existent sous `components/pdfs/{domaine}/NomPdf.jsx` et sont utilisés via `PdfDialogViewer`. Les DOCX suivent le même pattern mais produisent un objet `Document` (pas du JSX) et déclenchent un téléchargement :

```
components/
  pdfs/
    representants/SingleRepBlPdf.jsx     ← existant (PDF)
    fornisseurs/SyntheseRembPdf.jsx      ← existant (PDF)
    ...
  docx/
    representants/SingleRepBlDocx.jsx    ← NOUVEAU (template DOCX)
    fornisseurs/SyntheseRembDocx.jsx     ← NOUVEAU (template DOCX)
```

**Frontend :**

1. **Installation** : `npm install docx@^9.7.1` (pas besoin de `docx-preview` pour l'instant — simple téléchargement)
2. **Templates DOCX** (sous `components/docx/`) : Chaque composant exporte une fonction qui prend des données en paramètre et retourne un objet `Document` (du package `docx`).

   ```js
   // components/docx/representants/SingleRepBlDocx.jsx
   import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType } from "docx";

   export const SingleRepBlDocx = ({ bl_number, representant, date, type, mode_envoi, rawItems }) => {
       const doc = new Document({
           sections: [{
               children: [
                   new Paragraph({ children: [new TextRun({ text: `BL N°: ${bl_number}`, bold: true, size: 32 })] }),
                   // ... table
               ]
           }]
       });
       return doc;
   };
   ```

3. **Helper de téléchargement** : `lib/downloadDocx.js`

   ```js
   import { Packer } from "docx";

   export const downloadDocx = async (doc, filename) => {
       const blob = await Packer.toBlob(doc);
       const url = URL.createObjectURL(blob);
       const a = document.createElement("a");
       a.href = url;
       a.download = filename;
       a.click();
       URL.revokeObjectURL(url);
   };
   ```

4. **Intégration dans les pages** : Ajouter un bouton "DOCX" qui appelle `downloadDocx(template(data), "filename.docx")`.

5. **Impression** : Utiliser `window.print()` ou le composant `PdfDialogViewer` existant.

**Pages concernées :**

- Synthèse remboursement représentant
- Synthèse remboursement fournisseur
- Synthèses globales
- Factures individuelles (si applicable)

**Fichiers impactés :**

- `biblio/package.json` (ajout docx)
- `biblio/src/components/docx/representants/SingleRepBlDocx.jsx` (nouveau)
- `biblio/src/components/docx/fornisseurs/SyntheseRembDocx.jsx` (nouveau)
- `biblio/src/lib/downloadDocx.js` (nouveau)
- `biblio/src/pages/SynthèsesGlobales/RemboursementREP/`
- `biblio/src/pages/SynthèsesGlobales/RemboursementFournisseurs/`
- `biblio/src/pages/Fournisseurs/SyntheseRemboursement/`
- `biblio/src/pages/Représentant/SyntheseRemboursement/`

---

## Modification 7 — Déclaration dépôt par le REP uniquement

### Contexte actuel

- L'admin a une page `/dash/representant/declaration_depot` qui lui permet de voir toutes les déclarations et de les valider.
- Le REP a une page `/REP/dash/depot` pour déclarer et voir ses propres dépôts.

### Comportement attendu

Le dépôt doit être déclaré **uniquement par le REP**. L'admin ne doit **pas** pouvoir créer/modifier des déclarations de dépôt — seulement les **visualiser et valider**.

### Plan d'implémentation

1. **Modifier le comportement de l'admin** (`DeclarationDepotPage.jsx`) :
   - Supprimer le bouton "Ajouter" / "Créer" (actuellement pas présent — vérifier).
   - Rendre le tableau read-only (pas d'actions edit/delete).
   - Garder uniquement le toggle de validation (`valide` booléen) si applicable.
   - Option : changer en "Validation des dépôts REP" avec un titre différent.

2. **Backend** :
   - Vérifier que `DepotController` ne permet pas la création par admin si `EnsureUserIsAdmin` middleware interdit les accès admin.
   - Si besoin, ajouter une gate `$user->can('create', Depot::class)` ou middleware `rep` sur les routes POST/PUT/DELETE de `/api/depots`.
   - La route GET `/api/depots` reste accessible à l'admin pour la visualisation.

3. **Routes** (`api.php`) :
   - Actuellement `DepotController` est sous `auth:sanctum` (partagé admin + rep).
   - Option 1 : Créer un controller séparé `RepDepotController` pour le REP, et garder `DepotController` pour admin en read-only.
   - Option 2 (plus simple) : Vérifier le rôle dans le controller :

     ```php
     if (auth()->user() instanceof Admin) {
         if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
             return response()->json(['message' => 'Seuls les représentants peuvent déclarer des dépôts.'], 403);
         }
         // Read OK
     }
     ```

4. **REP page** (`RepDepotPage.jsx`) :
   - Vérifier que le REP peut toujours créer/modifier/supprimer ses propres dépôts.

**Fichiers impactés :**

- `biblio/src/pages/Représentant/DeclarationDepot/DeclarationDepotPage.jsx`
- `biblio/src/pages/REP/depot/RepDepotPage.jsx` (vérification)
- `nexgen-lms/app/Http/Controllers/Api/DepotController.php`
- `nexgen-lms/routes/api.php`

---

## Modification 8 — Sélection multi-saison

### Contexte actuel

Deux limitations bloquent le multi-saison :

1. **Backend** : `is_active` est traité comme singleton — activer une saison désactive toutes les autres (`SeasonController@store` ligne 37, `SeasonController@update` ligne 66, `SeasonController@setActive` ligne 108). `getActiveSeason()` retourne une seule saison.
2. **Frontend** : Le store a un `activeSeason` unique. L' `Axios` interceptor envoie `annee: activeSeason.label` (un seul paramètre). Le header de navigation affiche juste le label, pas de sélecteur.
3. **Filtre backend** : `FilterBySeason` ne gère qu'un seul `?annee` ou `?season_id`.

### Comportement attendu

1. **Multi-activation** : L'admin peut activer plusieurs saisons simultanément. Le toggle dans le tableau `SaisonTravailPage` ne désactive plus les autres.
2. **Filtre multi-saison dans le header** : Le label "SAISON : 26 / 27" dans le header devient un dropdown cliquable listant toutes les **saisons actives**. L'utilisateur peut en sélectionner plusieurs via checkboxes. Chaque sélection ajoute un badge. Action possible : "Tout sélectionner".
3. **Requêtes API** : Au lieu d'envoyer `?annee=2627`, le frontend envoie `?annees[]=2627&annees[]=2526` pour toutes les saisons sélectionnées.
4. **Backend** : `FilterBySeason` filtre par `whereIn` sur les `season_id` résolus. `FilterByActiveSeason` injecte la liste complète des saisons actives si aucun paramètre n'est fourni.
5. **Contexte de création** : `activeSeason` reste dans le store (une seule saison "par défaut" pour les nouvelles entrées), mais le filtre d'affichage / rapport utilise `selectedSeasons[]`.
6. **Ordre de travail** : Traiter d'abord le backend (rendre `is_active` multi), puis le header (sélecteur), puis l'interceptor Axios, puis adapter les pages une par une.

### Plan d'implémentation

#### Phase 1 — Backend : Permettre `is_active` multi

1. **`Season.php`** :
   - Renommer `getActiveSeason()` → `getActiveSeasons()` (pluriel). Retourner `where('is_active', true)->get()` (collection).

2. **`SeasonController.php`** :
   - `store()` (ligne 36-38) : Supprimer le bloc `if ($validated['is_active'] ?? false) { Season::where('is_active', true)->update(['is_active' => false]); }`.
   - `update()` (lignes 64-73) : Supprimer toute la logique de déactivation des autres saisons. Remplacer par simple mise à jour.
   - `setActive()` (lignes 97-126) : Simplifier — juste toggle `is_active` sur la saison ciblée, ne pas toucher aux autres. Supprimer les lignes 108 (`Season::where('id', '!=', $seasonId)->update(['is_active' => false]);`) et 112-115 (vérification `activeCount <= 1`).
   - `active()` (ligne 91-94) : Retourner **toutes** les saisons actives (collection) au lieu d'une seule.

3. **`FilterBySeason.php`** (trait) :
   - Lire les paramètres `annees[]` (tableau) en plus de `annee` (string).
   - Si `annees[]` est présent :
     - Pour chaque valeur, résoudre le `Season` par `name`, collecter les UUIDs.
     - Appliquer `$builder->whereIn($table . '.season_id', $seasonIds)`.
   - Si `annee` (string) est présent seul : comportement actuel (compatibilité).
   - Si `season_ids[]` est présent : résoudre et appliquer `whereIn`.

4. **`FilterByActiveSeason.php`** (middleware) :
   - Si aucun `?annee` ni `?season_id` ni `?annees[]` n'est fourni :
     - Injecter `?annees[]` avec les `name` de toutes les saisons actives (via `Season::getActiveSeasons()->pluck('name')->toArray()`).
   - Renommer si besoin l'ordre de priorité : `annee` (unique) > `annees[]` > fallback.

5. **`SeasonResource.php`** : Pas de changement nécessaire (retourne déjà tous les champs).

#### Phase 2 — Frontend : Store + Header multi-saison

1. **`useAppStore.js`** :
   - Garder `activeSeason` (contexte de création — quelle saison assigner aux nouvelles entrées).
   - Ajouter `selectedSeasons: []` (tableau des saisons sélectionnées pour le filtre).
   - Ajouter `setSelectedSeasons(seasons)` (remplacement complet).
   - Ajouter `toggleSeason(season)` (ajoute ou retire une saison).
   - Initialiser `selectedSeasons` après login : si `activeSeason` existe → `selectedSeasons = [activeSeason]`.
   - `logout()` : réinitialiser `selectedSeasons: []`.

2. **Nouveau composant `SeasonMultiSelect.jsx`** (sous `components/ui/`) :
   - Props : `seasons` (liste des saisons actives disponibles), `selected` (tableau des IDs sélectionnés), `onToggle(season)`, `onSelectAll()`, `onClear()`.
   - Rendu : dropdown avec checkboxes, badges pour les sélectionnées, boutons "Tout sélectionner" / "Tout effacer".
   - Style : aligné avec le header (text-xs, font-bold).

3. **`header.jsx`** :
   - Remplacer le `seasonLabel` statique par un dropdown interactif.
   - Au clic sur "SAISON : X / Y", ouvrir un popover contenant `SeasonMultiSelect`.
   - Afficher les saisons sélectionnées sous forme de badges compacts.
   - Données : récupérer les saisons actives via `seasonsService.getAll()` ou les passer depuis le store.

4. **`HeaderPages.jsx`** :
   - Mettre à jour le warning banner : au lieu de `!activeSeason`, vérifier `selectedSeasons.length === 0`.

#### Phase 3 — Frontend : Interceptor Axios

1. **`axios.js`** (lignes 31-33) :
   - Au lieu d'envoyer `annee: activeSeason.label`, envoyer `annees[]` pour chaque saison dans `selectedSeasons` :
     ```js
     const { selectedSeasons } = useAppStore.getState();
     if (selectedSeasons.length > 0) {
       selectedSeasons.forEach(s => {
         config.params[`annees[]`] = config.params[`annees[]`] || [];
         config.params[`annees[]`].push(s.label);
       });
     }
     ```
   - Ou plus simplement (car Axios sérialise les tableaux) :
     ```js
     if (selectedSeasons.length > 0) {
       config.params.annees = selectedSeasons.map(s => s.label);
     }
     ```
   - Axios enverra `?annees[]=2627&annees[]=2526` automatiquement.

#### Phase 4 — Frontend : Pages utilisant `activeSeason?.label`

Chaque page qui lit `activeSeason?.label` pour le filtre doit être mise à jour pour utiliser `selectedSeasons` à la place. Stratégie :

1. **Pages de filtre / listing** (Synthèses, rapports, tableaux de bord) :
   - Remplacer `activeSeason?.label ? { annee: activeSeason.label } : {}` par `{ annee: selectedSeasons.map(s => s.label).join(',') }` ou laisser l'interceptor gérer.
   - Si l'interceptor gère (Phase 3), ces pages n'ont rien à changer — elles peuvent juste omettre `annee` des params, l'interceptor l'ajoutera.
   - **Option recommandée** : Laisser l'interceptor Axios gérer l'envoi de `annees[]`. Les pages n'ont plus à passer `annee` manuellement, sauf si elles veulent outrepasser (ex: page spécifique qui affiche une seule saison).

2. **Pages qui affichent "Saison : X"** dans le titre :
   - Remplacer `schoolYearFormat(activeSeason?.label)` par `selectedSeasons.map(s => schoolYearFormat(s.label)).join(', ')`.

3. **Pages avec `useEffect` dépendant de `activeSeason?.label`** :
   - Remplacer par `selectedSeasons` (comme dépendance pour le refresh des données).

4. **`SaisonTravailPage.jsx`** :
   - Pas de changement UI majeur — le toggle `is_active` dans le tableau reste fonctionnel.
   - La différence est qu'au toggle, l'API ne désactive plus les autres saisons.

#### Phase 5 — Nettoyage

- Supprimer les passages manuels de `annee` dans les pages (laisser l'interceptor gérer).
- Vérifier que le `loadActiveSeason()` dans le store continue de fonctionner pour initialiser `selectedSeasons`.

### Ordre des tâches

1. Backend : `Season.php` → `SeasonController.php` → `FilterBySeason.php` → `FilterByActiveSeason.php`
2. Frontend : Store → `SeasonMultiSelect.jsx` → `header.jsx` → `axios.js` → Pages une par une

### Fichiers impactés

- `nexgen-lms/app/Models/Season.php`
- `nexgen-lms/app/Models/Traits/FilterBySeason.php`
- `nexgen-lms/app/Http/Controllers/Api/SeasonController.php`
- `nexgen-lms/app/Http/Middleware/FilterByActiveSeason.php`
- `biblio/src/store/useAppStore.js`
- `biblio/src/components/ui/SeasonMultiSelect.jsx` (nouveau)
- `biblio/src/components/template/header/header.jsx`
- `biblio/src/layouts/HeaderPages.jsx`
- `biblio/src/api/axios.js`
- `biblio/src/pages/Réglages/SaisonTravail/SaisonTravailPage.jsx`
- Nombreuses pages frontend (là où `activeSeason?.label` est utilisé dans les params API et les titres)

---

## Modification 9 — Saison lock/unlock/disable pour représentants

### Contexte actuel

`ReprésentantDisponibles.jsx` : tableau des représentants avec CRUD, toggle "Compte active". Aucun concept de saison liée au représentant. Chaque représentant peut accéder à toutes les saisons.

Le modèle `Representant` n'a pas de relation directe avec `Season`.

### Comportement attendu

Chaque représentant doit avoir un **état par saison** :

- **Disable** : Le REP ne peut pas accéder à la saison (bloqué).
- **Lock** : Le REP peut voir le contenu mais pas modifier/ajouter/supprimer.
- **Unlock** : Le REP peut modifier/ajouter/supprimer.

### Plan d'implémentation

**Backend :**

1. **Nouveau modèle pivot** `RepresentantSeason` (table `representant_season`) :

   ```php
   Schema::create('representant_season', function (Blueprint $table) {
       $table->uuid('id')->primary();
       $table->foreignUuid('representant_id')->constrained('representants')->cascadeOnDelete();
       $table->foreignUuid('season_id')->constrained('seasons')->cascadeOnDelete();
       $table->enum('status', ['unlock', 'lock', 'disabled'])->default('unlock');
       $table->timestamps();
       $table->unique(['representant_id', 'season_id']);
   });
   ```

2. **Modèle `RepresentantSeason`** :

   ```php
   class RepresentantSeason extends Model {
       use HasUuids;
       protected $fillable = ['representant_id', 'season_id', 'status'];
       public function representant() { return $this->belongsTo(Representant::class); }
       public function season() { return $this->belongsTo(Season::class); }
   }
   ```

3. **Relations sur `Representant`** :

   ```php
   public function seasons() {
       return $this->belongsToMany(Season::class, 'representant_season')
           ->withPivot('status')
           ->withTimestamps();
   }
   public function seasonStatuses() {
       return $this->hasMany(RepresentantSeason::class);
   }
   ```

4. **Nouveau controller** `RepresentantSeasonController` :
   - `GET /api/representants/{id}/seasons` — Récupérer les statuts saison du REP.
   - `PUT /api/representants/{id}/seasons/{seasonId}` — Mettre à jour le statut (lock/unlock/disable).
   - `POST /api/representants/{id}/seasons` — Associer une saison à un REP.

5. **Middleware ou helper** côté API : Filtrer les endpoints REP par rapport au statut de saison :
   - Si `disabled` → 403 Forbidden.
   - Si `lock` → GET autorisé, POST/PUT/DELETE → 403.
   - Si `unlock` → tout autorisé.

**Frontend (`ReprésentantDisponibles.jsx`) :**

1. **Nouvelle section/onglet** : Pour chaque représentant, ajouter un sous-tableau ou une modale "Gérer les saisons" qui liste toutes les saisons avec leur statut actuel.
2. **Affichage** : Colonne "Saisons" dans le tableau principal avec un badge par saison (vert = unlock, jaune = lock, rouge = disabled).
3. **Édition** :
   - Un dialog "Gérer les accès saison" qui liste toutes les saisons.
   - Pour chaque saison : select (Unlock / Lock / Disabled).
   - Bouton "Enregistrer" qui appelle l'API.
4. **Nouveau component** : `SeasonAccessManager.jsx` (ou intégré dans le dialog d'édition du REP).

**Frontend — Application côté REP :**

1. **Hook/guard** côté REP : Avant d'afficher une page REP, vérifier le statut de la saison pour ce REP :
   - Si disabled → rediriger vers une page "Accès refusé" avec message "Cette saison vous est inaccessible".
   - Si lock → désactiver tous les boutons d'ajout/modification/suppression (UI read-only).
   - Si unlock → fonctionnement normal.

**Fichiers impactés :**

- `nexgen-lms/database/migrations/xxxx_create_representant_season_table.php`
- `nexgen-lms/app/Models/RepresentantSeason.php` (nouveau)
- `nexgen-lms/app/Models/Representant.php` (nouvelles relations)
- `nexgen-lms/app/Models/Season.php` (nouvelle relation many-to-many)
- `nexgen-lms/app/Http/Controllers/Api/RepresentantSeasonController.php` (nouveau)
- `nexgen-lms/routes/api.php`
- `biblio/src/pages/Représentant/ReprésentantDisponibles/ReprésentantDisponibles.jsx`
- `biblio/src/components/rep/SeasonAccessManager.jsx` (nouveau)
- `biblio/src/api/services/representantSeasonService.js` (nouveau)
- Guards/protected routes côté REP pour appliquer les restrictions

---

## Résumé des fichiers à créer

| Fichier | Type | Pour |
|---|---|---|
| `nexgen-lms/app/Http/Controllers/Api/UploadController.php` | Backend Controller | Image upload |
| `nexgen-lms/app/Models/RepresentantSeason.php` | Backend Model | Season-Rep pivot |
| `nexgen-lms/app/Http/Controllers/Api/RepresentantSeasonController.php` | Backend Controller | Season status CRUD |
| `biblio/src/components/docx/representants/SingleRepBlDocx.jsx` | Frontend Component | DOCX template for Single BL |
| `biblio/src/components/docx/fornisseurs/SyntheseRembDocx.jsx` | Frontend Component | DOCX template for fournisseur remboursement |
| `biblio/src/lib/downloadDocx.js` | Frontend Lib | DOCX download helper |
| `biblio/src/components/ui/SeasonMultiSelect.jsx` | Frontend Component | Multi-season filter |
| `biblio/src/components/rep/SeasonAccessManager.jsx` | Frontend Component | Season lock/unlock UI |
| `biblio/src/api/services/representantSeasonService.js` | Frontend Service | API calls for season status |

## Résumé des migrations à modifier vs créer

**Migrations existantes à modifier** (ajouter des colonnes, pas de nouveau fichier) :

| Migration existante | Table | Colonnes à ajouter |
|---|---|---|
| `2026_02_07_182105_create_rep_remboursements_table.php` | `rep_remboursements` | `a_lordre_de_id` (FK → imprimeurs) |
| `2026_02_07_172708_create_remb_imps_table.php` | `remb_imp` | `rep_id` (FK → representants) + `statut_retourne`, `date_retour`, `motif_retour` |

**Nouvelle migration à créer** (seulement si c'est une nouvelle table) :

| Migration | Table | Colonnes |
|---|---|---|
| `xxxx_create_representant_season_table.php` | `representant_season` | `representant_id`, `season_id`, `status` (enum) |
