<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class BLivraison extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;

    protected $fillable = [
        'rep_id',
        'season_id',
        'entity_type',
        'bl_number',
        'date_emission',
        'type',
        'mode_envoi',
        'statut_recu',
        'statut_vu',
        'status',
        'annee',
        'remarks'
    ];

    public $incrementing = false; //
    protected $keyType = 'string';

    // Relation: Each BL belongs to one representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: Each BL belongs to a season
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id');
    }

    // Relation: One BL can have many books (Items)
    public function items()
    {
        return $this->morphMany(BLivraisonItem::class, 'deliverable');
    }
}
