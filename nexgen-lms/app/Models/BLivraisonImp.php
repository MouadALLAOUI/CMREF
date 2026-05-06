<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BLivraisonImp extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'imprimeur_id',
        'date_reception',
        'b_livraison_number',
        'annee',
        'remarks'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation: The printer/supplier who sent the books
    public function imprimeur()
    {
        return $this->belongsTo(Imprimeur::class, 'imprimeur_id');
    }

    public function items()
    {
        return $this->morphMany(BLivraisonItem::class, 'deliverable');
    }
}
