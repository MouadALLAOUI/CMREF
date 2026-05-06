<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Representant extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable, HasApiTokens;

    protected $fillable = [
        'nom',
        'cin',
        'destination_id',
        'tel',
        'email',
        'adresse',
        'code_postale',
        'ville',
        'lieu_de_travail',
        'login',
        'password',
        'last_online_at',
    ];


    protected $hidden = ['password'];

    protected $casts = [
        'last_online_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function login()
    {
        return $this->morphOne(Login::class, 'authenticatable');
    }

    public function clients()
    {
        return $this->hasMany(Client::class, 'representant_id');
    }

    public function bls()
    {
        return $this->hasMany(BLivraison::class, 'rep_id');
    }

    public function remboursements()
    {
        return $this->hasMany(RepRemboursement::class, 'rep_id');
    }

    public function depot()
    {
        return $this->hasOne(Depot::class, 'rep_id');
    }

    public function depots()
    {
        return $this->hasMany(Depot::class, 'rep_id');
    }
}
