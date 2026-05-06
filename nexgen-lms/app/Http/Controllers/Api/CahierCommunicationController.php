<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CahierCommunication;
use Illuminate\Http\Request;

use App\Http\Resources\CahierCommunicationResource;

class CahierCommunicationController extends Controller
{
    public function index()
    {
        $cahierCommunications = CahierCommunication::with('representant')->latest()
            ->where('is_deleted', false)
            ->paginate(1000);
        return CahierCommunicationResource::collection($cahierCommunications);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'ecole' => 'required|string|max:255',
            'type' => 'required|string',
            'qte' => 'required|integer|min:1',
            'date_commande' => 'required|date',
            'nom_fichier' => 'nullable|string',
            'indication' => 'nullable|string',
            'annee_scolaire' => 'nullable|string',
            'remarques' => 'nullable|string',
        ]);

        $cahierCommunication = CahierCommunication::create($validatedData);
        return new CahierCommunicationResource($cahierCommunication);
    }

    public function show($id)
    {
        $cahierCommunication = CahierCommunication::findOrFail($id)->where('is_deleted', false);
        return new CahierCommunicationResource($cahierCommunication);
    }

    public function update(Request $request, $id)
    {
        $cahierCommunication = CahierCommunication::findOrFail($id);

        $validatedData = $request->validate([
            'ecole' => 'sometimes|string',
            'type' => 'sometimes|string',
            'qte' => 'sometimes|integer',
            'is_accepted' => 'sometimes|boolean',
            'is_refused' => 'sometimes|boolean',
            'is_printed' => 'sometimes|boolean',
            'is_delivered' => 'sometimes|boolean',
            'etat_model' => 'sometimes|integer',
            'remarques' => 'nullable|string',
        ]);

        $cahierCommunication->update($validatedData);

        return new CahierCommunicationResource($cahierCommunication);
    }

    public function destroy($id)
    {
        $cahierCommunication = CahierCommunication::findOrFail($id);
        // $cahierCommunication->delete();

        // Set the flag to true
        $cahierCommunication->is_deleted = true;
        $cahierCommunication->save();

        // 200 OK is better here since you are actually returning a modified resource
        return response()->json([
            'message' => 'Marqué supprimé',
            'data' => $cahierCommunication
        ], 200);
    }
}
