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
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public static function getActiveSeason()
    {
        return static::where('is_active', true)->first();
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
}
