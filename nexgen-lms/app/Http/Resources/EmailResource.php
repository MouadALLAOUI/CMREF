<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'destinataire' => $this->destinataire,
            'sujet' => $this->sujet,
            'message' => $this->message,
            'type' => $this->type,
            'statut' => $this->statut,
            'emetteur_type' => $this->emetteur_type,
            'emetteur_id' => $this->emetteur_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
