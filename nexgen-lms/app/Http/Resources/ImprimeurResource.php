<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImprimeurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'raison_sociale' => $this->raison_sociale,
            'adresse' => $this->adresse,
            'directeur_nom' => $this->directeur_nom,
            'directeur_tel' => $this->directeur_tel,
            'directeur_email' => $this->directeur_email,
            'adjoint_nom' => $this->adjoint_nom,
            'adjoint_tel' => $this->adjoint_tel,
            'adjoint_email' => $this->adjoint_email,
        ];
    }
}
