<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'season_id' => $this->season_id,
            'entity_type' => $this->entity_type,
            'sequence_id' => $this->sequence_id,
            'demande_id' => $this->demande_id,
            'year_session' => $this->year_session,
            'number' => $this->number,
            'fact_number' => $this->fact_number,
            'date_facture' => $this->date_facture,
            'total_ht' => $this->total_ht,
            'tva_rate' => $this->tva_rate,
            'total_ttc' => $this->total_ttc,
            'reste_a_payer' => $this->reste_a_payer,
            'status' => $this->status,
            'remarques' => $this->remarques,
            'type' => $this->type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'details' => DetFactResource::collection($this->whenLoaded('details')),
        ];
    }
}
