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

    protected $hidden = ['created_at', 'updated_at'];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Relation: Every book belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }

    // Relation: A book can be in many delivery note items
    public function blivraisonItems()
    {
        return $this->hasMany(BLivraisonItem::class, 'livre_id');
    }

    // Relation: A book can be sold to many clients
    public function ventesClients()
    {
        return $this->hasMany(BVentesClient::class, 'livre_id');
    }

    // Relation: A book can appear in many invoice details
    public function detFacts()
    {
        return $this->hasMany(DetFact::class, 'livre_id');
    }

    // Relation: A book can have many depots
    public function depots()
    {
        return $this->hasMany(Depot::class, 'livre_id');
    }
}
