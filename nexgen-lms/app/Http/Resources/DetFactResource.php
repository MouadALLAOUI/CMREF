<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetFactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fact_id' => $this->fact_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'livre_id' => $this->livre_id,
            'quantite' => $this->quantite,
            'prix_unitaire_ht' => $this->prix_unitaire_ht,
            'remise' => $this->remise,
            'total_ligne_ht' => $this->total_ligne_ht,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'livre' => new LivreResource($this->whenLoaded('livre')),
        ];
    }
}
