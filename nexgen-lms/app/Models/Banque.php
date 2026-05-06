<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Banque extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['nom', 'code_abreviation', 'logo_path', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function rep_remboursements()
    {
        return $this->hasMany(RepRemboursement::class, 'banque_id');
    }

    public function client_remboursements()
    {
        return $this->hasMany(ClientRemboursement::class, 'banque_id');
    }

    public function remb_imp()
    {
        return $this->hasMany(RembImp::class, 'banque_id');
    }
}
