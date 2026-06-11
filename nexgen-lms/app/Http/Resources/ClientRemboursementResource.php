<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientRemboursementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'client_id' => $this->client_id,
            'date_payment' => $this->date_payment,
            'banque_id' => $this->banque_id,
            'banque_nom' => $this->banque_nom,
            'cheque_number' => $this->cheque_number,
            'cheque_image_path' => $this->cheque_image_path,
            'cheque_url' => $this->cheque_url,
            'a_lordre_de' => $this->a_lordre_de,
            'montant' => $this->montant,
            'observation' => $this->observation,
            'remarks' => $this->remarks,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'client' => new ClientResource($this->whenLoaded('client')),
        ];
    }
}
