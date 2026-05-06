<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemandeF extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'demande_f'; // Nom exact de la table

    protected $fillable = [
        'rep_id',
        'client_id',
        'date_demande',
        'ref',
        'type',
        // 'objet', // Ensure this exists in your migration
        'statut',
        'livree',
        'annee_scolaire',
        'contenu',
        'remarks',
    ];

    protected $casts = [
        'date_demande' => 'date',
        'statut' => 'integer',
        'livree' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation : La demande appartient à un représentant
    public function representant(): BelongsTo
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation : La demande concerne un client spécifique
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    /**
     * Relation: A request can have one invoice
     */
    public function fact()
    {
        return $this->hasOne(Fact::class, 'demande_id');
    }
}
