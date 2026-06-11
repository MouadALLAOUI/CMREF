<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\ScopedByRepresentant;
use App\Models\Traits\FilterBySeason;

class Depot extends Model
{
    use HasFactory, HasUuids, ScopedByRepresentant, FilterBySeason;
    protected $fillable = [
        'rep_id',
        'season_id',
        'entity_type',
        'livre_id',
        'type',
        'quantite_balance',
        'status',

        'remarks'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public $incrementing = false; // Disable auto-incrementing since we're using UUIDs
    protected $keyType = 'string';

    // Relation: The representative owning this stock line
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: The book being tracked
    public function livre()
    {
        return $this->belongsTo(Livre::class, 'livre_id');
    }

    // Relation: Each depot belongs to a season
    public function season()
    {
        return $this->belongsTo(Season::class, 'season_id');
    }
}
