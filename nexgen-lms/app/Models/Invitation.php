<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Invitation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'email',
        'role',
        'message',
        'token',
        'expires_at',
        'accepted_at',
        'statut',
        'emetteur_type',
        'emetteur_id',
    ];

    protected $hidden = ['token', 'created_at', 'updated_at'];

    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function emetteur()
    {
        return $this->morphTo();
    }

    public static function generateToken(): string
    {
        return Str::random(64);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en attente');
    }

    public function scopeActives($query)
    {
        return $query->where('statut', 'en attente')
            ->where('expires_at', '>', now());
    }
}
