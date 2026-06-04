<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CahierCommunication;
use Illuminate\Http\Request;

use App\Http\Resources\CahierCommunicationResource;

class CahierCommunicationController extends Controller
{
    public function index(Request $request)
    {
        $query = CahierCommunication::with('representant')
            ->where('is_deleted', false)
            ->latest();

        if ($request->has('page')) {
            $perPage = min((int) $request->query('per_page', 15), 100);
            $paginator = $query->paginate($perPage);
            return response()->json([
                'data' => CahierCommunicationResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        }

        $cahierCommunications = $query->paginate(1000);
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
        $cahierCommunication = CahierCommunication::where('is_deleted', false)->findOrFail($id);
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
        $cahierCommunication->update(['is_deleted' => true]);

        return response()->json(null, 204);
    }
}
