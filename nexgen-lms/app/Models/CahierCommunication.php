<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CahierCommunication extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'cahier_communication';

    protected $fillable = [
        'rep_id',
        'ecole',
        'type',
        'qte',
        'nom_fichier',
        'date_commande',
        'bon_de_commande',
        'indication',
        'model_recto',
        'model_verso',
        'is_accepted',
        'is_refused',
        'etat_model',
        'date_validate_model',
        'is_bc_validated',
        'is_printed',
        'is_delivered',
        'is_deleted',
        'remarques',
        'annee_scolaire'
    ];

    protected $casts = [
        'is_accepted' => 'boolean',
        'is_refused' => 'boolean',
        'is_bc_validated' => 'boolean',
        'is_printed' => 'boolean',
        'is_delivered' => 'boolean',
        'is_deleted' => 'boolean',
        'date_validate_model' => 'datetime',
        'date_commande' => 'date',
        'qte' => 'integer',
        'etat_model' => 'integer',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation : Chaque entrée appartient à un représentant
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }
}
