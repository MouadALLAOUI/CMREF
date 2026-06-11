<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BLivraisonImpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'imprimeur_id' => $this->imprimeur_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'date_reception' => $this->date_reception,
            'b_livraison_number' => $this->b_livraison_number,
            'remarks' => $this->remarks,
            'imprimeur' => new ImprimeurResource($this->whenLoaded('imprimeur')),
            'items' => BLivraisonItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
