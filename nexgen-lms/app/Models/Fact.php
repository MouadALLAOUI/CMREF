<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fact extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'fact'; // Forces Laravel to use 'fact' instead of 'facts'

    protected $fillable = [
        'rep_id',
        'sequence_id',
        'demande_id',
        'year_session',
        'number',
        'fact_number',
        'date_facture',
        'total_ht',
        'tva_rate',
        'total_ttc',
        'status',
        'remarques'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation: An invoice belongs to a representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: An invoice can belong to a billing request
    public function demande()
    {
        return $this->belongsTo(DemandeF::class, 'demande_id');
    }

    // Relation: One invoice header has many details (the actual books)
    public function details()
    {
        return $this->hasMany(DetFact::class, 'fact_id');
    }

    public function sequence()
    {
        return $this->belongsTo(FactSequence::class, 'sequence_id');
    }

    /**
     * Virtual attribute for the type of invoice (MSM-MEDIAS or Wataniya)
     */
    protected $appends = ['type'];

    public function getTypeAttribute()
    {
        $seqNom = $this->sequence?->nom ?? '';
        if (str_contains(strtolower($seqNom), 'msm')) return 'MSM';
        if (str_contains(strtolower($seqNom), 'watan')) return 'Wataniya';

        // If not found in sequence, maybe check remarks or other fields
        // Defaulting based on the year session to provide some variety in dev
        return (intval(substr($this->year_session, 0, 4)) % 2 === 0) ? 'MSM' : 'Wataniya';
    }
}
