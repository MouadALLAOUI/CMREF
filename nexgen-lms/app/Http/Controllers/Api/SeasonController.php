<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeasonResource;
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
        return SeasonResource::collection($seasons);
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

        $season = Season::create($validated);
        Cache::forget(self::CACHE_KEY);
        return response()->json(new SeasonResource($season), 201);
    }

    public function show($id)
    {
        $season = Season::findOrFail($id);
        return new SeasonResource($season);
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

        $season->update($validated);
        Cache::forget(self::CACHE_KEY);
        return new SeasonResource($season);
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
        $activeSeasons = Season::getActiveSeasons();
        return SeasonResource::collection($activeSeasons);
    }

    public function setActive(Request $request)
    {
        $validated = $request->validate([
            'season_id' => 'required|uuid|exists:seasons,id',
            'is_active' => 'required|boolean',
        ]);

        $seasonId = $validated['season_id'];
        $nextActive = $validated['is_active'];

        Season::where('id', $seasonId)->update(['is_active' => $nextActive]);

        $statusMessage = $nextActive ? 'activée' : 'désactivée';

        Cache::forget(self::CACHE_KEY);

        return response()->json([
            'message' => "La saison a été {$statusMessage} avec succès"
        ]);
    }
}
