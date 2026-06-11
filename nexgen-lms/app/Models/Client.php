<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;

class Client extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant;

    protected $fillable = [
        'representant_id',
        'destination_id',
        'raison_sociale',
        'ville',
        'adresse',
        'tel',
        'email'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: Every client belongs to one representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'representant_id');
    }

    // Relation: Every client belongs to a destination
    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }
}
