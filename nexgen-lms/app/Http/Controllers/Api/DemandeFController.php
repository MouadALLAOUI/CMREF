<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeF;
use Illuminate\Http\Request;

use App\Http\Resources\DemandeFResource;

class DemandeFController extends Controller
{
    public function index()
    {
        $demandeFs = DemandeF::with(['representant', 'client', 'fact'])->latest('date_demande')->get();
        return DemandeFResource::collection($demandeFs);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id'         => 'required|uuid|exists:representants,id',
            'client_id'      => 'required|uuid|exists:clients,id',
            'date_demande'   => 'required|date',
            'ref'            => 'required|integer',
            'type'           => 'required|string|max:255',
            // 'objet'          => 'nullable|string|max:255',
            'statut'         => 'required|integer', // Match migration integer type
            'livree'         => 'sometimes|boolean',
            'annee_scolaire' => 'nullable|string|max:4',
            'contenu'        => 'nullable|string',
            'remarks'        => 'nullable|string',
        ]);

        $demandeF = DemandeF::create($validatedData);
        return new DemandeFResource($demandeF->load(['representant', 'client']));
    }

    public function show($id)
    {
        $demandeF = DemandeF::findOrFail($id);
        return new DemandeFResource($demandeF->load(['representant', 'client']));
    }

    public function update(Request $request, $id)
    {
        $demandeF = DemandeF::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id'         => 'sometimes|uuid|exists:representants,id',
            'client_id'      => 'sometimes|uuid|exists:clients,id',
            'date_demande'   => 'sometimes|date',
            'ref'            => 'sometimes|integer',
            'type'           => 'sometimes|string|max:255',
            'objet'          => 'nullable|string|max:255',
            'statut'         => 'sometimes|integer',
            'livree'         => 'sometimes|boolean',
            'annee_scolaire' => 'nullable|string|max:4',
            'contenu'        => 'nullable|string',
            'remarks'        => 'nullable|string',
        ]);

        $demandeF->update($validatedData);

        return new DemandeFResource($demandeF);
    }

    public function destroy($id)
    {
        $demandeF = DemandeF::findOrFail($id);
        $demandeF->delete();

        return response()->json(['message' => 'Deleted successfully'], 204);
    }
}
