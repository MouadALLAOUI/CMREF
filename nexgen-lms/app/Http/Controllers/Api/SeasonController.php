<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeasonController extends Controller
{
    public function index()
    {
        $seasons = Season::orderBy('name', 'asc')->get();
        return response()->json($seasons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'start_year' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'end_year' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            Season::where('is_active', true)->update(['is_active' => false]);
        }

        $season = Season::create($validated);
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
            'end_date' => 'sometimes|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['is_active']) && $validated['is_active']) {
            Season::where('id', '!=', $id)->where('is_active', true)->update(['is_active' => false]);
        }

        $season->update($validated);
        return response()->json($season);
    }

    public function destroy($id)
    {
        $season = Season::findOrFail($id);
        $season->delete();
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
            'is_active' => 'required|boolean', // 👈 Added this to know if you are turning it ON or OFF
        ]);

        // Update ONLY the target season record
        Season::where('id', $validated['season_id'])->update([
            'is_active' => $validated['is_active']
        ]);

        $statusMessage = $validated['is_active'] ? 'activée' : 'désactivée';

        return response()->json([
            'message' => "La saison a été {$statusMessage} avec succès"
        ]);
    }
}
