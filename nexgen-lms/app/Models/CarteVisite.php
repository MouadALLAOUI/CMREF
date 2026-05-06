<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarteVisite extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'rep_id',
        'model',
        'date_commande',
        'nom_sur_carte',
        'fonction',
        'tel',
        'email',
        'adresse',
        'autre_info',
        'logo_path',
        'chevalet_ligne_1',
        'chevalet_ligne_2',
        'chevalet_ligne_3',
        'conception_carte',
        'is_valide_carte',
        'conception_chevalet',
        'is_valide_chevalet',
        'comment_cv',
        'comment_chevalet',
        'remarques',
        'prod_carte',
        'livraison_carte',
        'recu_carte',
        'prod_chevalet',
        'livraison_chevalet',
        'recu_chevalet',
        'annee_scolaire',
        'is_deleted'
    ];

    protected $casts = [
        'date_commande' => 'date',
        'is_valide_carte' => 'boolean',
        'is_valide_chevalet' => 'boolean',
        'prod_carte' => 'boolean',
        'livraison_carte' => 'boolean',
        'recu_carte' => 'boolean',
        'prod_chevalet' => 'boolean',
        'livraison_chevalet' => 'boolean',
        'recu_chevalet' => 'boolean',
        'is_deleted' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation: Each distribution is linked to a representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }
}
