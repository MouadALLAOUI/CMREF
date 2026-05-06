<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BLivraisonItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'livre' => $this->livre, // Nested book data
            'quantite' => $this->quantite,
            'deliverable' => $this->deliverable, // This will be either the Rep BL or Imp BL
            'created_at' => $this->created_at,
        ];
    }
}
