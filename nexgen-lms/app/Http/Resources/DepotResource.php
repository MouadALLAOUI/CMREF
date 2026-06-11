<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'livre_id' => $this->livre_id,
            'type' => $this->type,
            'quantite_balance' => $this->quantite_balance,
            'status' => $this->status,

            'remarks' => $this->remarks,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'livre' => new LivreResource($this->whenLoaded('livre')),
        ];
    }
}
