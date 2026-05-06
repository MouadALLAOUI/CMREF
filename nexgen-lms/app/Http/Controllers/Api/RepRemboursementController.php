<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RepRemboursement;
use Illuminate\Http\Request;

use App\Http\Resources\RepRemboursementResource;

class RepRemboursementController extends Controller
{
    public function index()
    {
        $repRemboursements = RepRemboursement::with(['representant', 'banque', 'facture'])->get();
        return RepRemboursementResource::collection($repRemboursements);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'fact_id' => 'nullable|uuid|exists:fact,id',
            'date_payment' => 'required|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'type_versement' => 'required|in:En main propre,Virement,Versement',
            'compte' => 'nullable|string',
            'montant' => 'required|numeric|min:0',
            'date_prevue' => 'nullable|date',
            'date_versement' => 'nullable|date',
            'statut_recu' => 'sometimes|boolean',
            'statut_rejete' => 'sometimes|boolean',
            'statut_accepte' => 'sometimes|boolean',
            'annee' => 'sometimes',
            'remarks' => 'nullable|string',
        ]);

        $repRemboursement = RepRemboursement::create($validatedData);
        return new RepRemboursementResource($repRemboursement);
    }

    public function show($id)
    {
        $repRemboursement = RepRemboursement::findOrFail($id);
        return new RepRemboursementResource($repRemboursement);
    }

    public function update(Request $request, $id)
    {
        $repRemboursement = RepRemboursement::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'fact_id' => 'nullable|uuid|exists:fact,id',
            'date_payment' => 'sometimes|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'type_versement' => 'sometimes|in:En main propre,Virement,Versement',
            'compte' => 'nullable|string',
            'montant' => 'sometimes|numeric|min:0',
            'date_prevue' => 'nullable|date',
            'date_versement' => 'nullable|date',
            'statut_recu' => 'sometimes|boolean',
            'statut_rejete' => 'sometimes|boolean',
            'statut_accepte' => 'sometimes|boolean',
            'annee' => 'sometimes',
            'remarks' => 'nullable|string',
        ]);

        $repRemboursement->update($validatedData);

        return new RepRemboursementResource($repRemboursement);
    }

    public function destroy($id)
    {
        $repRemboursement = RepRemboursement::findOrFail($id);
        $repRemboursement->delete();

        return response()->json(null, 204);
    }
}
