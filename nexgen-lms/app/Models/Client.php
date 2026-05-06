<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'representant_id',
        'destination_id',
        'raison_sociale',
        'ville',
        'adresse',
        'tel',
        'email'
    ];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: Every client belongs to one representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'representant_id');
    }
}
