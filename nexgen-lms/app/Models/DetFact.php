<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetFact extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'det_fact'; // Forced singular name

    protected $fillable = [
        'fact_id',
        'livre_id',
        'quantite',
        'prix_unitaire_ht',
        'remise',
        'total_ligne_ht'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation: Link back to the invoice header
    public function fact()
    {
        return $this->belongsTo(Fact::class, 'fact_id');
    }

    // Relation: Get the book details for this line item
    public function livre()
    {
        return $this->belongsTo(Livre::class, 'livre_id');
    }
}
