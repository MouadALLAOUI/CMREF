<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'categorie_id' => $this->categorie_id,
            'image_url' => $this->image_url,
            'content' => $this->content,
        ];
    }
}
