<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\BLivraison;

trait ScopedByRepresentant
{
    public static function bootScopedByRepresentant()
    {
        static::addGlobalScope('rep_scope', function (Builder $builder) {
            $user = Auth::user();
            if ($user && $user->role === 'representant' && $user->profile) {
                $repId = $user->profile->id;
                $model = new static();
                $table = $model->getTable();

                if ($table === 'clients') {
                    $builder->where('representant_id', $repId);
                } elseif ($table === 'b_livraison_items') {
                    $builder->where(function ($query) use ($repId) {
                        $query->where('deliverable_type', BLivraison::class)
                              ->whereHasMorph('deliverable', [BLivraison::class], function ($q) use ($repId) {
                                  $q->where('rep_id', $repId);
                              });
                    });
                } elseif ($table === 'det_fact') {
                    $builder->whereHas('fact', function ($query) use ($repId) {
                        $query->where('rep_id', $repId);
                    });
                } else {
                    $builder->where('rep_id', $repId);
                }
            }
        });

        static::saving(function ($model) {
            $user = Auth::user();
            if ($user && $user->role === 'representant' && $user->profile) {
                $repId = $user->profile->id;
                $table = $model->getTable();

                if ($table === 'clients') {
                    $model->representant_id = $repId;
                } elseif ($table === 'b_livraison_items' || $table === 'det_fact') {
                    // Handled by parent relation
                } else {
                    $model->rep_id = $repId;
                }
            }
        });
    }
}
