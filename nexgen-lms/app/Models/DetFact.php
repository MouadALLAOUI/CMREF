<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class DetFact extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;

    protected $table = 'det_fact'; // Forced singular name

    protected $fillable = [
        'fact_id',
        'season_id',
        'entity_type',
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

    // Relation: Each detail belongs to a season
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id');
    }
}
