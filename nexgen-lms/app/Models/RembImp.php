<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RembImp extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'remb_imp'; // Keeping requested legacy name

    protected $fillable = [
        'imprimeur_id',
        'date_payment',
        'banque_id',
        'banque_nom',
        'cheque_number',
        'cheque_image_path',
        'montant',
        'statut_recu',
        'statut_rejete',
        'remarks'
    ];

    protected $casts = [
        'statut_recu' => 'boolean',
        'statut_rejete' => 'boolean',
        'date_payment' => 'date',
        'montant' => 'float',
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

    // Relation: Payment belongs to a Printer/Supplier
    public function imprimeur()
    {
        return $this->belongsTo(Imprimeur::class, 'imprimeur_id');
    }

    public function banque()
    {
        return $this->belongsTo(Banque::class, 'banque_id');
    }
}
