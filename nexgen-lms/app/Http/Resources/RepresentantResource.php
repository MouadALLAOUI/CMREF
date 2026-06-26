<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepresentantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'cin' => $this->cin,
            'destination_id' => $this->destination_id,
            'tel' => $this->tel,
            'email' => $this->email,
            'adresse' => $this->adresse,
            'code_postale' => $this->code_postale,
            'ville' => $this->ville,
            'lieu_de_travail' => $this->lieu_de_travail,
            'last_online_at' => $this->last_online_at,
            'login' => $this->whenLoaded('loginRecord', fn() => [
                'id' => $this->loginRecord->id,
                'username' => $this->loginRecord->username,
                'role' => $this->loginRecord->role,
                'is_online' => $this->loginRecord->is_online,
                'last_visit' => $this->loginRecord->last_visit,
            ]),
            'season_statuses' => $this->whenLoaded('seasonStatuses', fn() =>
                $this->seasonStatuses->map(fn($s) => [
                    'id' => $s->id,
                    'season_id' => $s->season_id,
                    'season_name' => $s->season?->name,
                    'status' => $s->status,
                ])
            ),
        ];
    }
}
