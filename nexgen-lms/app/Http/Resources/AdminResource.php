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
            'login' => $this->whenLoaded('loginRecord', fn() => [
                'id' => $this->loginRecord->id,
                'username' => $this->loginRecord->username,
                'role' => $this->loginRecord->role,
                'is_active' => $this->loginRecord->is_active,
                'is_online' => $this->loginRecord->is_online,
                'last_visit' => $this->loginRecord->last_visit,
            ]),
        ];
    }
}
