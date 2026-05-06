<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'login',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    // Important: Tell Laravel IDs are not auto-incrementing integers
    public $incrementing = false;
    protected $keyType = 'string';

    public function login()
    {
        return $this->morphOne(Login::class, 'authenticatable');
    }
}
