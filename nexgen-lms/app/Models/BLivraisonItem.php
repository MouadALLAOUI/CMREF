<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class BLivraisonItem extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;

    protected $fillable = [
        'deliverable_id',
        'deliverable_type',
        'livre_id',
        'quantite',
        'season_id',
        'entity_type'
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

    // Relation: Each item belongs to a season
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id');
    }
}
