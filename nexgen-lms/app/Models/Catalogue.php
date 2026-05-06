<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catalogue extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'titre',
        'categorie_id',
        'image_url',
        'content'
    ];

    public $incrementing = false; //
    protected $keyType = 'string';

    // Relation: Each catalogue entry belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }
}
