<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DemandeFResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'client_id' => $this->client_id,
            'date_demande' => $this->date_demande,
            'ref' => $this->ref,
            'type' => $this->type,
            'statut' => $this->statut,
            'livree' => $this->livree,
            'annee_scolaire' => $this->annee_scolaire,
            'contenu' => $this->contenu,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'client' => new ClientResource($this->whenLoaded('client')),
        ];
    }
}
