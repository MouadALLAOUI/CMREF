<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use App\Models\Season;

trait FilterBySeason
{
    public static function bootFilterBySeason()
    {
        static::addGlobalScope('season_filter', function (Builder $builder) {
            $seasonId = request()->query('season_id');
            $annee = request()->query('annee');

            $model = new static();
            $table = $model->getTable();

            if ($seasonId) {
                if (Schema::hasColumn($table, 'season_id')) {
                    $builder->where($table . '.season_id', $seasonId);
                }
            } elseif ($annee) {
                if (Schema::hasColumn($table, 'season_id')) {
                    $season = Season::where('name', $annee)->first();
                    if ($season) {
                        $builder->where($table . '.season_id', $season->id);
                    } elseif (Schema::hasColumn($table, 'annee')) {
                        $builder->where($table . '.annee', $annee);
                    }
                } elseif (Schema::hasColumn($table, 'annee')) {
                    $builder->where($table . '.annee', $annee);
                }
            }
        });

        static::saving(function ($model) {
            $table = $model->getTable();
            if (Schema::hasColumn($table, 'season_id') && empty($model->season_id)) {
                $activeSeason = Season::getActiveSeason();
                if ($activeSeason) {
                    $model->season_id = $activeSeason->id;
                }
            }
        });
    }
}
