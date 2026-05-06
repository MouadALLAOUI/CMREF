<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BVentesClient extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'rep_id',
        'client_id',
        'b_vente_number',
        'date_vente',
        'type',
        'livre_id',
        'quantite',
        'remise',
        'remarks'
    ];

    public $incrementing = false; //
    protected $keyType = 'string';

    // Relation: The representative who made the sale
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: The school/bookstore that bought the books
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    // Relation: The book that was sold
    public function livre()
    {
        return $this->belongsTo(Livre::class, 'livre_id');
    }
}
