<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EmailLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'destinataire',
        'sujet',
        'message',
        'type',
        'statut',
        'emetteur_type',
        'emetteur_id',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public $incrementing = false;
    protected $keyType = 'string';

    public function emetteur()
    {
        return $this->morphTo();
    }

    public function scopeEnvoyes($query)
    {
        return $query->where('statut', 'envoyé');
    }

    public function scopeEchoues($query)
    {
        return $query->where('statut', 'échoué');
    }
}
