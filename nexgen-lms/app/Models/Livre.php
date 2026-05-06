<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livre extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'titre',
        'code',
        'categorie_id',
        'prix_achat',
        'prix_vente',
        'prix_public',
        'nb_pages',
        'color_code',
        'description',
        'annee_publication'
    ];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: Every book belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }
}
