<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepRemboursement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'rep_id',
        'fact_id',
        'date_payment',
        'banque_id',
        'cheque_number',
        'cheque_image_path',
        'type_versement',
        'compte',
        'montant',
        'date_prevue',
        'date_versement',
        'statut_recu',
        'statut_rejete',
        'statut_accepte',
        'annee',
        'remarks'
    ];

    // This makes the 'cheque_url' visible when you send JSON to React
    // protected $appends = ['cheque_url'];

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
}
