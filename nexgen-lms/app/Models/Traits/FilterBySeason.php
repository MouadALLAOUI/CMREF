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
            $seasonIds = request()->query('season_ids', []);
            $annee = request()->query('annee');
            $annees = request()->query('annees', []);

            $model = new static();
            $table = $model->getTable();

            if (!Schema::hasColumn($table, 'season_id')) {
                if ($annees || $annee) {
                    $col = Schema::hasColumn($table, 'annee') ? $table . '.annee' : null;
                    if ($col) {
                        $values = $annees ?: [$annee];
                        $builder->whereIn($col, $values);
                    }
                }
                return;
            }

            // Resolve season_ids from name lookup or raw UUIDs
            $resolveIds = function ($names) {
                $matched = Season::whereIn('name', $names)->pluck('id')->toArray();
                $raw = array_diff($names, Season::whereIn('name', $names)->pluck('name')->toArray());
                return array_merge($matched, $raw);
            };

            if ($seasonIds) {
                $builder->whereIn($table . '.season_id', (array) $seasonIds);
            } elseif ($annees) {
                $ids = $resolveIds((array) $annees);
                if ($ids) {
                    $builder->whereIn($table . '.season_id', $ids);
                }
            } elseif ($annee) {
                $season = Season::where('name', $annee)->first();
                if ($season) {
                    $builder->where($table . '.season_id', $season->id);
                } elseif (Schema::hasColumn($table, 'annee')) {
                    $builder->where($table . '.annee', $annee);
                }
            }
        });

        static::saving(function ($model) {
            $table = $model->getTable();
            if (Schema::hasColumn($table, 'season_id') && empty($model->season_id)) {
                $activeSeason = Season::getActiveSeasons()->first();
                if ($activeSeason) {
                    $model->season_id = $activeSeason->id;
                }
            }
        });
    }
}
