<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BLivraisonItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'deliverable_id',
        'deliverable_type',
        'livre_id',
        'quantite'
    ];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: Link back to the header
    public function deliverable()
    {
        return $this->morphTo();
    }

    // Relation: Link to the specific book details
    public function livre()
    {
        return $this->belongsTo(Livre::class, 'livre_id');
    }
}
