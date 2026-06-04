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
            'destination_id' => $this->destination_id,
            'tel' => $this->tel,
            'email' => $this->email,
            'adresse' => $this->adresse,
            'code_postale' => $this->code_postale,
            'ville' => $this->ville,
            'lieu_de_travail' => $this->lieu_de_travail,
            'login' => $this->login,
            'last_online_at' => $this->last_online_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'login_data' => $this->whenLoaded('login', fn() => [
                'id' => $this->login->id,
                'username' => $this->login->username,
                'role' => $this->login->role,
                'is_active' => $this->login->is_active,
                'is_online' => $this->login->is_online,
                'last_visit' => $this->login->last_visit,
            ]),
        ];
    }
}
