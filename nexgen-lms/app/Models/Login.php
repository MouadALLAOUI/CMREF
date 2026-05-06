<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Login extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'username',
        'password',
        'authenticatable_id',
        'authenticatable_type',
        'role',
        'is_online',
        'is_active',
        'last_visit',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the parent model (Admin or Representant).
     */
    public function profile()
    {
        return $this->morphTo(__FUNCTION__, 'authenticatable_type', 'authenticatable_id');
    }

    /**
     * Helper to check if the user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
