<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BLivraisonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'bl_number' => $this->bl_number,
            'date_emission' => $this->date_emission,
            'type' => $this->type,
            'mode_envoi' => $this->mode_envoi,
            'statut_recu' => $this->statut_recu,
            'statut_vu' => $this->statut_vu,
            'status' => $this->status,
            'annee' => $this->annee,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'items' => BLivraisonItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
