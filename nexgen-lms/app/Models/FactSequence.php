<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FactSequence extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = ['nom', 'dernier_numero', 'est_active'];

    // Important: Tell Laravel IDs are not auto-incrementing integers
    public $incrementing = false;
    protected $keyType = 'string';

    // Professional Logic: Get next number and increment
    public static function getNextNumber($session)
    {
        $sequence = self::firstOrCreate(['nom' => $session]);
        $sequence->increment('dernier_numero');
        return $sequence->dernier_numero;
    }

    // Relation: One sequence can be used by many invoices
    public function facts()
    {
        return $this->hasMany(Fact::class, 'sequence_id');
    }
}