<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepresentantSeason extends Model
{
    use HasUuids;

    protected $table = 'representant_season';

    protected $fillable = [
        'representant_id',
        'season_id',
        'status',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function representant(): BelongsTo
    {
        return $this->belongsTo(Representant::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}
