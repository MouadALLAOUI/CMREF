<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CahierTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'description' => $this->description,
            'contenu' => $this->contenu,
            'variables' => $this->variables,
            'est_actif' => $this->est_actif,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
