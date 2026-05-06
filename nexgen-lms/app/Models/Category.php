<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'libelle',
        'description',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relation: One category has many books
    public function livres()
    {
        return $this->hasMany(Livre::class, 'categorie_id');
    }
}
