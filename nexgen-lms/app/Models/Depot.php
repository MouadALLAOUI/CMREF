<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depot extends Model
{
    use HasFactory, HasUlids;
    protected $fillable = [
        'rep_id',
        'livre_id',
        'type',
        'quantite_balance',
        'status',
        'annee_scolaire',
        'remarks'
    ];

    public $incrementing = false; // Disable auto-incrementing since we're using UUIDs
    protected $keyType = 'string';

    // Relation: The representative owning this stock line
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: The book being tracked
    public function livre()
    {
        return $this->belongsTo(Livre::class, 'livre_id');
    }
}
