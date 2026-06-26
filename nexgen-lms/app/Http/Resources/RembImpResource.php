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
            'statut_retourne' => $this->statut_retourne,
            'date_retour' => $this->date_retour,
            'motif_retour' => $this->motif_retour,
            'remarks' => $this->remarks,
            'imprimeur' => new ImprimeurResource($this->whenLoaded('imprimeur')),
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
        ];
    }
}
