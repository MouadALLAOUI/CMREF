<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imprimeur extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'raison_sociale',
        'adresse',
        'directeur_nom',
        'directeur_tel',
        'directeur_email',
        'adjoint_nom',
        'adjoint_tel',
        'adjoint_email'
    ];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: An imprimeur provides many incoming delivery notes (BL_imp)
    public function bls()
    {
        return $this->hasMany(BLivraisonImp::class, 'imprimeur_id');
    }
}
