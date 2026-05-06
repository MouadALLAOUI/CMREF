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
        $seasons = Season::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($seasons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
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
        $validated = $request->validate([
            'season_id' => 'required|uuid|exists:seasons,id',
        ]);

        DB::transaction(function () use ($validated) {
            Season::where('is_active', true)->update(['is_active' => false]);
            Season::find($validated['season_id'])->update(['is_active' => true]);
        });

        return response()->json(['message' => 'Season activated successfully']);
    }
}
