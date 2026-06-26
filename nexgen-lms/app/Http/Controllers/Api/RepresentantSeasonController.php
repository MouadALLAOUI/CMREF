<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Representant;
use App\Models\Season;
use App\Models\RepresentantSeason;
use Illuminate\Http\Request;

class RepresentantSeasonController extends Controller
{
    public function index($representantId)
    {
        $representant = Representant::findOrFail($representantId);
        $seasons = $representant->seasonStatuses()->with('season')->get();
        return response()->json($seasons);
    }

    public function sync(Request $request, $representantId)
    {
        $representant = Representant::findOrFail($representantId);

        $validated = $request->validate([
            'seasons' => 'required|array',
            'seasons.*.season_id' => 'required|uuid|exists:seasons,id',
            'seasons.*.status' => 'required|in:unlock,lock,disabled',
        ]);

        foreach ($validated['seasons'] as $item) {
            RepresentantSeason::updateOrCreate(
                [
                    'representant_id' => $representant->id,
                    'season_id' => $item['season_id'],
                ],
                ['status' => $item['status']]
            );
        }

        $seasons = $representant->seasonStatuses()->with('season')->get();
        return response()->json($seasons);
    }

    public function update(Request $request, $representantId, $seasonId)
    {
        $representant = Representant::findOrFail($representantId);
        Season::findOrFail($seasonId);

        $validated = $request->validate([
            'status' => 'required|in:unlock,lock,disabled',
        ]);

        $record = RepresentantSeason::updateOrCreate(
            [
                'representant_id' => $representant->id,
                'season_id' => $seasonId,
            ],
            ['status' => $validated['status']]
        );

        return response()->json($record->load('season'));
    }

    public function destroy($representantId, $seasonId)
    {
        RepresentantSeason::where('representant_id', $representantId)
            ->where('season_id', $seasonId)
            ->delete();

        return response()->json(null, 204);
    }
}
