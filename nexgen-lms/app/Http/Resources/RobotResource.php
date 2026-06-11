<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RobotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rep_id' => $this->rep_id,
            'destination_id' => $this->destination_id,
            'date_operation' => $this->date_operation,
            'ville' => $this->ville,
            'etablissement' => $this->etablissement,
            'contact_nom' => $this->contact_nom,
            'contact_tel' => $this->contact_tel,
            'reference_robot' => $this->reference_robot,
            'quantite_vue' => $this->quantite_vue,
            'quantite_recue' => $this->quantite_recue,
            'images' => $this->images,
            'image_urls' => $this->image_urls,
            'statut' => $this->statut,
            'remarques' => $this->remarques,
            'representant' => new RepresentantResource($this->whenLoaded('representant')),
            'destination' => new DestinationResource($this->whenLoaded('destination')),
        ];
    }
}
