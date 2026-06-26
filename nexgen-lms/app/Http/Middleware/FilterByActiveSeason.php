<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Season;

class FilterByActiveSeason
{
    /**
     * If the request already carries a season filter (?annee or ?season_id),
     * let it pass through unchanged. Otherwise inject the currently active
     * season so the FilterBySeason global scope always has something to
     * filter on.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->has('annee') && !$request->has('season_id') && !$request->has('annees')) {
            $activeSeasons = Season::getActiveSeasons();
            if ($activeSeasons->isNotEmpty()) {
                $request->merge([
                    'annees' => $activeSeasons->pluck('name')->toArray(),
                ]);
            }
        }

        return $next($request);
    }
}
