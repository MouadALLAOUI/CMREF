Viewed BLivraisonItem.php:1-45

Voici le cheminement détaillé, étape par étape, de la base de données jusqu'au frontend React pour les **Ventes** et les **Livraisons** dans le cadre du rapport de stock.

---

# 1. Le Chemin des VENTES (Sales)

### 1️⃣ Base de Données (Database)
Les données transitent par trois tables reliées :
1. **`destinations`** : Stocke les destinations (ex: `Settat`, `Marrakech`).
2. **`representants`** : Possède une clé étrangère `destination_id` pointant vers `destinations.id`.
3. **`b_ventes_clients`** : Enregistre les ventes individuelles des représentants. Elle possède les colonnes suivantes :
   * `rep_id` : Clé étrangère pointant vers `representants.id`.
   * `season_id` : Clé étrangère pointant vers la saison active.
   * `livre_id` : Clé étrangère pointant vers le livre vendu.
   * `quantite` : Nombre d'unités vendues.

---

### 2️⃣ Modèles Eloquent (Laravel Models)
Le lien se fait par une relation de type `hasManyThrough` dans le modèle [Destination.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Models/Destination.php#L37-L47) :

```php
// Modèle Destination.php
public function ventes()
{
    return $this->hasManyThrough(
        BVentesClient::class, // Modèle final ciblé
        Representant::class,   // Modèle intermédiaire
        'destination_id',     // Clé étrangère sur la table 'representants'
        'rep_id',             // Clé étrangère sur la table 'b_ventes_clients'
        'id',                 // Clé locale sur la table 'destinations'
        'id'                  // Clé locale sur la table 'representants'
    );
}
```

* Le modèle [BVentesClient.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Models/BVentesClient.php) utilise le trait `FilterBySeason` pour s'auto-scoper dynamiquement sur la saison passée dans l'URL.

---

### 3️⃣ Contrôleur & Ressource API (Controllers & Resources)
1. **Contrôleur** : [DestinationController.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Http/Controllers/Api/DestinationController.php#L37-L43) appelle la relation `ventes` avec ses sous-relations (`livre` et `category`) via l'eager loading :
   ```php
   $destinations = Destination::with([
       'representants',
       'ventes.livre.category',
       'livraisons.items.livre.category'
   ])->get();
   ```
2. **Ressource** : [DestinationResource.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Http/Resources/DestinationResource.php#L17) sérialise les ventes uniquement si elles ont été chargées (`whenLoaded`) :
   ```php
   'ventes' => BVentesClientResource::collection($this->whenLoaded('ventes')),
   ```

---

### 4️⃣ Client API Frontend (Axios)
Le frontend effectue une requête HTTP GET vers l'API via [destinationService.js](file:///d:/workplace/windows/CMREF/biblio/src/api/services/destinationService.js#L4) :
```javascript
getAll: (params) => api.get('/destinations', { params }),
```
*(Où `params` inclut l'identifiant de la saison active sous la forme `?season_id=XXX`).*

---

### 5️⃣ Intégration React (Frontend UI & Hook)
1. **Hook de traitement** : [useStockReport.js](file:///d:/workplace/windows/CMREF/biblio/src/hooks/useStockReport.js#L76-L84) récupère la liste des destinations et calcule la somme des ventes par livre :
   ```javascript
   if (dest.ventes) {
     dest.ventes.forEach(vente => {
       const code = vente.livre?.code || vente.livre_id;
       const bookRow = initBook(code, catId, catName);
       bookRow.vente += Number(vente.quantite || 0);
     });
   }
   ```
2. **Affichage UI** : [HomePage.jsx](file:///d:/workplace/windows/CMREF/biblio/src/pages/home/HomePage.jsx#L16-L21) appelle le hook et affiche les graphiques ou le tableau récapitulatif.

---

# 2. Le Chemin des LIVRAISONS (Deliveries / Stock)

### 1️⃣ Base de Données (Database)
Les mouvements de stock liés aux livraisons transitent par quatre tables :
1. **`destinations`** : Stocke les destinations de livraison.
2. **`representants`** : Possède la clé `destination_id` pointant vers `destinations.id`.
3. **`b_livraisons`** : Table "En-tête" du bon de livraison (contient `rep_id`, `season_id`, `type` de livraison).
4. **`b_livraison_items`** : Table "Détails" contenant les lignes du bon de livraison (les livres livrés). Elle possède :
   * `deliverable_id` & `deliverable_type` : Relation polymorphique pointant vers `b_livraisons.id`.
   * `livre_id` : Clé étrangère pointant vers `livres.id`.
   * `quantite` : Nombre de livres livrés.

---

### 2️⃣ Modèles Eloquent (Laravel Models)
Le lien de la destination vers l'en-tête de livraison se fait par `hasManyThrough` dans [Destination.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Models/Destination.php#L49-L59) :

```php
// Modèle Destination.php
public function livraisons()
{
    return $this->hasManyThrough(
        BLivraison::class,   // Modèle final ciblé (l'en-tête du BL)
        Representant::class, // Modèle intermédiaire
        'destination_id',
        'rep_id',
        'id',
        'id'
    );
}
```
* Chaque en-tête [BLivraison.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Models/BLivraison.php#L45-L49) a ensuite une relation polymorphique vers ses lignes [BLivraisonItem.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Models/BLivraisonItem.php) :
  ```php
  public function items() {
      return $this->morphMany(BLivraisonItem::class, 'deliverable');
  }
  ```

---

### 3️⃣ Contrôleur & Ressource API (Controllers & Resources)
1. **Contrôleur** : [DestinationController.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Http/Controllers/Api/DestinationController.php#L40) charge de manière imbriquée (`nested eager loading`) les livraisons, leurs lignes (`items`), les livres de chaque ligne et leur catégorie :
   ```php
   'livraisons.items.livre.category'
   ```
2. **Ressource** : [DestinationResource.php](file:///d:/workplace/windows/CMREF/nexgen-lms/app/Http/Resources/DestinationResource.php#L18) expose les données des livraisons :
   ```php
   'livraisons' => BLivraisonResource::collection($this->whenLoaded('livraisons')),
   ```

---

### 4️⃣ Client API Frontend (Axios)
Le frontend appelle l'API via [destinationService.js](file:///d:/workplace/windows/CMREF/biblio/src/api/services/destinationService.js#L4) avec les paramètres de requête de saison correspondants.

---

### 5️⃣ Intégration React (Frontend UI & Hook)
1. **Hook de traitement** : [useStockReport.js](file:///d:/workplace/windows/CMREF/biblio/src/hooks/useStockReport.js#L85-L104) extrait chaque ligne d'article (`item`) de chaque bon de livraison, et cumule les quantités selon le type de livraison :
   ```javascript
   if (dest.livraisons) {
     dest.livraisons.forEach(livraison => {
       if (livraison.items) {
         livraison.items.forEach(item => {
           const code = item.livre?.code || item.livre_id;
           const qte = Number(item.quantite || 0);

           if (livraison.type === 'Specimen') {
             bookRow.specimen += qte; // Échantillon gratuit (déduit du stock)
           } else if (livraison.type === 'Retour') {
             bookRow.rejet += qte;    // Retour de stock (+)
           } else {
             bookRow.achat += qte;     // Entrée en stock standard (+)
             bookRow.livraison += qte; // Volume total livré
           }
         });
       }
     });
   }
   ```
2. **Calcul final du Stock** : Le stock final est calculé dans le hook à la ligne 110 :
   $$\text{stock} = \text{achat} - \text{vente} - \text{specimen} + \text{rejet}$$
3. **Affichage UI** : Rendu graphique des stocks, achats et ventes via [HomePage.jsx](file:///d:/workplace/windows/CMREF/biblio/src/pages/home/HomePage.jsx).