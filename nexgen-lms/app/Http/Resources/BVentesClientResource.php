<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BVentesClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'client_id' => $this->client_id,
            'b_vente_number' => $this->b_vente_number,
            'date_vente' => $this->date_vente,
            'type' => $this->type,
            'livre_id' => $this->livre_id,
            'quantite' => $this->quantite,
            'remise' => $this->remise,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'client' => new ClientResource($this->whenLoaded('client')),
            'livre' => new LivreResource($this->whenLoaded('livre')),
        ];
    }
}
