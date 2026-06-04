<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RembImpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'season_id' => $this->season_id,
            'imprimeur_id' => $this->imprimeur_id,
            'date_payment' => $this->date_payment,
            'banque_id' => $this->banque_id,
            'banque_nom' => $this->banque_nom,
            'cheque_number' => $this->cheque_number,
            'cheque_image_path' => $this->cheque_image_path,
            'cheque_url' => $this->cheque_url,
            'montant' => $this->montant,
            'statut_recu' => $this->statut_recu,
            'statut_rejete' => $this->statut_rejete,
            'remarks' => $this->remarks,
            'annee' => $this->annee,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'imprimeur' => new ImprimeurResource($this->whenLoaded('imprimeur')),
        ];
    }
}
