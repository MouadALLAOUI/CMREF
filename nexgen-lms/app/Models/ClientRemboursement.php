<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientRemboursement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'rep_id',
        'client_id',
        'date_payment',
        'banque_id',
        'banque_nom',
        'cheque_number',
        'cheque_image_path',
        'a_lordre_de',
        'montant',
        'observation',
        'remarks'
    ];

    // Accessor for the React frontend
    protected $appends = ['cheque_url'];

    public $incrementing = false; // Required for UUIDs
    protected $keyType = 'string';

    // Automatically generates the full URL for the image
    public function getChequeUrlAttribute()
    {
        return $this->cheque_image_path
            ? asset('storage/' . $this->cheque_image_path)
            : null;
    }

    // Relation: Payment belongs to a Representative
    public function representant()
    {
        return $this->belongsTo(Representant::class, 'rep_id');
    }

    // Relation: Payment belongs to a Client (School)
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function banque()
    {
        return $this->belongsTo(Banque::class, 'banque_id');
    }
}
