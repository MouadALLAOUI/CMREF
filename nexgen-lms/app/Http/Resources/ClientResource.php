<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'representant_id' => $this->representant_id,
            'destination_id' => $this->destination_id,
            'raison_sociale' => $this->raison_sociale,
            'ville' => $this->ville,
            'adresse' => $this->adresse,
            'tel' => $this->tel,
            'email' => $this->email,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'destination' => new DestinationResource($this->whenLoaded('destination')),
        ];
    }
}
