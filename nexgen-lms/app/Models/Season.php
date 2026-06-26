<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Season extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'start_date',
        'start_year',
        'end_date',
        'end_year',
        'is_active',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public static function getActiveSeasons()
    {
        return static::where('is_active', true)->get();
    }

    public function bLivraisons()
    {
        return $this->hasMany(BLivraison::class);
    }

    public function repRemboursements()
    {
        return $this->hasMany(RepRemboursement::class);
    }

    public function factures()
    {
        return $this->hasMany(Fact::class);
    }

    public function representants()
    {
        return $this->belongsToMany(Representant::class, 'representant_season')
            ->withPivot('status')
            ->withTimestamps();
    }
}
