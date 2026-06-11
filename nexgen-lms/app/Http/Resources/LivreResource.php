<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LivreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'code' => $this->code,
            'categorie_id' => $this->categorie_id,
            'prix_achat' => $this->prix_achat,
            'prix_vente' => $this->prix_vente,
            'prix_public' => $this->prix_public,
            'nb_pages' => $this->nb_pages,
            'color_code' => $this->color_code,
            'description' => $this->description,
            'annee_publication' => $this->annee_publication,
            'category' => $this->whenLoaded('category'),
        ];
    }
}
