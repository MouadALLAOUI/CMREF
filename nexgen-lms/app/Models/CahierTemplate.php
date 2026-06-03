<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CahierTemplate extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nom',
        'description',
        'contenu',
        'variables',
        'est_actif',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';
}
