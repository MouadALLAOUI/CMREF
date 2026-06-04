<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarteVisiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'model' => $this->model,
            'date_commande' => $this->date_commande,
            'nom_sur_carte' => $this->nom_sur_carte,
            'fonction' => $this->fonction,
            'tel' => $this->tel,
            'email' => $this->email,
            'adresse' => $this->adresse,
            'autre_info' => $this->autre_info,
            'logo_path' => $this->logo_path,
            'chevalet_ligne_1' => $this->chevalet_ligne_1,
            'chevalet_ligne_2' => $this->chevalet_ligne_2,
            'chevalet_ligne_3' => $this->chevalet_ligne_3,
            'conception_carte' => $this->conception_carte,
            'is_valide_carte' => $this->is_valide_carte,
            'conception_chevalet' => $this->conception_chevalet,
            'is_valide_chevalet' => $this->is_valide_chevalet,
            'comment_cv' => $this->comment_cv,
            'comment_chevalet' => $this->comment_chevalet,
            'remarques' => $this->remarques,
            'prod_carte' => $this->prod_carte,
            'livraison_carte' => $this->livraison_carte,
            'recu_carte' => $this->recu_carte,
            'prod_chevalet' => $this->prod_chevalet,
            'livraison_chevalet' => $this->livraison_chevalet,
            'recu_chevalet' => $this->recu_chevalet,
            'annee_scolaire' => $this->annee_scolaire,
            'is_deleted' => $this->is_deleted,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
        ];
    }
}
