<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
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
