<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class CahierCommunication extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;

    protected $table = 'cahier_communication';

    protected $fillable = [
        'rep_id',
        'season_id',
        'entity_type',
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
        'remarques'
    ];

    protected $hidden = ['created_at', 'updated_at'];

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
