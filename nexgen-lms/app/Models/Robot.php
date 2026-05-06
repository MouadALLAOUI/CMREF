<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Robot extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'rep_id',
        'destination_id',
        'date_operation',
        'ville',
        'etablissement',
        'contact_nom',
        'contact_tel',
        'reference_robot',
        'quantite_vue',
        'quantite_recue',
        'images',
        'statut',
        'remarques'
    ];

    // Automatically convert JSON to Array and vice-versa
    protected $casts = [
        'images' => 'array',
    ];

    // Append full URLs to the JSON response for React
    protected $appends = ['image_urls'];

    public $incrementing = false;
    protected $keyType = 'string';

    // Accessor: Returns an array of full URLs for the frontend
    public function getImageUrlsAttribute()
    {
        if (!$this->images) return [];

        return array_map(function ($path) {
            return asset('storage/' . $path);
        }, $this->images);
    }

    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }
}
