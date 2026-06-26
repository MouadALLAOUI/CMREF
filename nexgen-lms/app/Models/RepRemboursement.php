<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class RepRemboursement extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;

    protected $fillable = [
        'rep_id',
        'season_id',
        'entity_type',
        'fact_id',
        'date_payment',
        'banque_id',
        'cheque_number',
        'cheque_image_path',
        'a_lordre_de_id',
        'type_versement',
        'compte',
        'montant',
        'date_prevue',
        'date_versement',
        'statut_recu',
        'statut_rejete',
        'statut_accepte',
        'statut_retourne',
        'date_retour',
        'motif_retour',
        'remarks'
    ];

    protected $hidden = ['compte', 'created_at', 'updated_at'];

    protected $casts = [
        'statut_recu' => 'boolean',
        'statut_rejete' => 'boolean',
        'statut_accepte' => 'boolean',
        'statut_retourne' => 'boolean',
        'date_retour' => 'date',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Accessor to get the full URL for the React frontend
    public function getChequeUrlAttribute()
    {
        return $this->cheque_image_path
            ? asset('storage/' . $this->cheque_image_path)
            : null;
    }

    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    public function banque()
    {
        return $this->belongsTo(Banque::class, 'banque_id');
    }

    public function facture()
    {
        return $this->belongsTo(Fact::class, 'fact_id');
    }

    public function aLordreDe()
    {
        return $this->belongsTo(Imprimeur::class, 'a_lordre_de_id');
    }

    // Relation: Each repayment belongs to a season
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id');
    }
}
