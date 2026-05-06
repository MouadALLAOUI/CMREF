<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'destination',
        'description',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // In your Destination.php Model
    public function representants()
    {
        return $this->hasMany(Representant::class);
    }

    public function robots()
    {
        return $this->hasMany(Robot::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function ventes()
    {
        return $this->hasManyThrough(
            BVentesClient::class,
            Representant::class,
            'destination_id', // Foreign key on the representants table
            'rep_id',         // Foreign key on the b_ventes_clients table
            'id',             // Local key on the destinations table
            'id'              // Local key on the representants table
        );
    }

    public function livraisons()
    {
        return $this->hasManyThrough(
            BLivraison::class,
            Representant::class,
            'destination_id', // Foreign key on the representants table
            'rep_id',         // Foreign key on the b_ventes_clients table
            'id',             // Local key on the destinations table
            'id'              // Local key on the representants table
        );
    }
}
