<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepRemboursementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'fact_id' => $this->fact_id,
            'date_payment' => $this->date_payment,
            'banque_id' => $this->banque_id,
            'cheque_number' => $this->cheque_number,
            'cheque_image_path' => $this->cheque_image_path,
            'a_lordre_de_id' => $this->a_lordre_de_id,
            'type_versement' => $this->type_versement,
            'montant' => $this->montant,
            'date_prevue' => $this->date_prevue,
            'date_versement' => $this->date_versement,
            'statut_recu' => $this->statut_recu,
            'statut_rejete' => $this->statut_rejete,
            'statut_accepte' => $this->statut_accepte,
            'statut_retourne' => $this->statut_retourne,
            'date_retour' => $this->date_retour,
            'motif_retour' => $this->motif_retour,
            'remarks' => $this->remarks,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'banque' => new BanqueResource($this->whenLoaded('banque')),
            'facture' => new FactResource($this->whenLoaded('facture')),
            'a_ordre_de' => new ImprimeurResource($this->whenLoaded('aLordreDe')),
        ];
    }
}
