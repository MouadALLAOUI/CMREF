<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'destination' => $this->destination,
            'description' => $this->description,
            'representants' => RepresentantResource::collection($this->whenLoaded('representants')),
            'ventes' => BVentesClientResource::collection($this->whenLoaded('ventes')),
            'livraisons' => BLivraisonResource::collection($this->whenLoaded('livraisons')),
        ];
    }
}
