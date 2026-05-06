<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FactSequence;
use Illuminate\Http\Request;

use App\Http\Resources\FactSequenceResource;

class FactSequenceController extends Controller
{
    public function index()
    {
        $factSequences = FactSequence::paginate(1000);
        return FactSequenceResource::collection($factSequences);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:9|unique:fact_sequences',
            'dernier_numero' => 'sometimes|integer|min:0',
            'est_active' => 'sometimes|boolean',
        ]);

        $factSequence = FactSequence::create($validatedData);
        return new FactSequenceResource($factSequence);
    }

    public function show($id)
    {
        $factSequence = FactSequence::findOrFail($id);
        return new FactSequenceResource($factSequence);
    }

    public function update(Request $request, $id)
    {
        $factSequence = FactSequence::findOrFail($id);

        $validatedData = $request->validate([
            'nom' => 'sometimes|string|max:9|unique:fact_sequences,nom,' . $factSequence->id,
            'dernier_numero' => 'sometimes|integer|min:0',
            'est_active' => 'sometimes|boolean',
        ]);

        $factSequence->update($validatedData);

        return new FactSequenceResource($factSequence);
    }

    public function destroy($id)
    {
        $factSequence = FactSequence::findOrFail($id);
        $factSequence->delete();

        return response()->json(null, 204);
    }
}
