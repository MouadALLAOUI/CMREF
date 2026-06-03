<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class SeasonController extends Controller
{
    private const CACHE_KEY = 'seasons_all';
    private const CACHE_TTL = 3600;

    public function index()
    {
        $seasons = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Season::orderBy('name', 'asc')->get();
        });
        return response()->json($seasons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'start_year' => 'required|string|size:4',
            'end_date' => 'required|date|after:start_date',
            'end_year' => 'required|string|size:4',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            Season::where('is_active', true)->update(['is_active' => false]);
        }

        $season = Season::create($validated);
        Cache::forget(self::CACHE_KEY);
        return response()->json($season, 201);
    }

    public function show($id)
    {
        $season = Season::findOrFail($id);
        return response()->json($season);
    }

    public function update(Request $request, $id)
    {
        $season = Season::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'start_year' => 'sometimes|string|size:4',
            'end_date' => 'sometimes|date|after:start_date',
            'end_year' => 'sometimes|string|size:4',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['is_active'])) {
            if ($validated['is_active']) {
                Season::where('id', '!=', $id)->where('is_active', true)->update(['is_active' => false]);
            } else {
                // Deactivating
                $activeCount = Season::where('is_active', true)->count();
                if ($season->is_active && $activeCount <= 1) {
                    return response()->json(['message' => 'Impossible de désactiver la seule saison active. Veuillez d\'abord activer une autre saison.'], 422);
                }
            }
        }

        $season->update($validated);
        Cache::forget(self::CACHE_KEY);
        return response()->json($season);
    }

    public function destroy($id)
    {
        $season = Season::findOrFail($id);
        if ($season->is_active) {
            return response()->json(['message' => 'Impossible de supprimer la saison active. Veuillez d\'abord activer une autre saison.'], 422);
        }
        $season->delete();
        Cache::forget(self::CACHE_KEY);
        return response()->json(null, 204);
    }

    public function active()
    {
        $activeSeason = Season::getActiveSeason();
        return response()->json($activeSeason);
    }

    public function setActive(Request $request)
    {
        // Validate both the season ID and the boolean state you want to apply
        $validated = $request->validate([
            'season_id' => 'required|uuid|exists:seasons,id',
            'is_active' => 'required|boolean',
        ]);

        $seasonId = $validated['season_id'];
        $nextActive = $validated['is_active'];

        if ($nextActive) {
            // Activate target, deactivate others
            Season::where('id', '!=', $seasonId)->update(['is_active' => false]);
            Season::where('id', $seasonId)->update(['is_active' => true]);
        } else {
            // Deactivating
            $season = Season::findOrFail($seasonId);
            $activeCount = Season::where('is_active', true)->count();
            if ($season->is_active && $activeCount <= 1) {
                return response()->json(['message' => 'Impossible de désactiver la seule saison active. Veuillez d\'abord activer une autre saison.'], 422);
            }
            Season::where('id', $seasonId)->update(['is_active' => false]);
        }

        $statusMessage = $nextActive ? 'activée' : 'désactivée';

        Cache::forget(self::CACHE_KEY);

        return response()->json([
            'message' => "La saison a été {$statusMessage} avec succès"
        ]);
    }
}
