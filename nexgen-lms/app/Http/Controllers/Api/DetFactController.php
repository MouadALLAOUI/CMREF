<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetFact;
use Illuminate\Http\Request;

use App\Http\Resources\DetFactResource;

class DetFactController extends Controller
{
    public function index()
    {
        $detFacts = DetFact::with(['fact', 'livre'])->paginate(1000);
        return DetFactResource::collection($detFacts);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'fact_id' => 'required|uuid|exists:fact,id',
            'livre_id' => 'required|uuid|exists:livres,id',
            'quantite' => 'sometimes|integer|min:1',
            'prix_unitaire_ht' => 'required|numeric|min:0',
            'remise' => 'sometimes|numeric|min:0|max:100',
            'total_ligne_ht' => 'required|numeric|min:0',
        ]);

        $detFact = DetFact::create($validatedData);
        return new DetFactResource($detFact);
    }

    public function show($id)
    {
        $detFact = DetFact::findOrFail($id);
        return new DetFactResource($detFact);
    }

    public function update(Request $request, $id)
    {
        $detFact = DetFact::findOrFail($id);

        $validatedData = $request->validate([
            'fact_id' => 'sometimes|uuid|exists:fact,id',
            'livre_id' => 'sometimes|uuid|exists:livres,id',
            'quantite' => 'sometimes|integer|min:1',
            'prix_unitaire_ht' => 'sometimes|numeric|min:0',
            'remise' => 'sometimes|numeric|min:0|max:100',
            'total_ligne_ht' => 'sometimes|numeric|min:0',
        ]);

        $detFact->update($validatedData);

        return new DetFactResource($detFact);
    }

    public function destroy($id)
    {
        $detFact = DetFact::findOrFail($id);
        $detFact->delete();

        return response()->json(null, 204);
    }
}
