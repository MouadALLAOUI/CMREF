<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->role,
            'message' => $this->message,
            'expires_at' => $this->expires_at,
            'accepted_at' => $this->accepted_at,
            'statut' => $this->statut,
            'emetteur_type' => $this->emetteur_type,
            'emetteur_id' => $this->emetteur_id,
        ];
    }
}
