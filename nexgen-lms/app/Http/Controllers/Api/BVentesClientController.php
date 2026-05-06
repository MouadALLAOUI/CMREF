<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BVentesClient;
use Illuminate\Http\Request;

use App\Http\Resources\BVentesClientResource;

class BVentesClientController extends Controller
{
    public function index()
    {
        $bVentesClients = BVentesClient::with(['representant', 'client', 'livre'])->paginate(1000);
        return BVentesClientResource::collection($bVentesClients);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'client_id' => 'required|uuid|exists:clients,id',
            'b_vente_number' => 'required|string|max:50',
            'date_vente' => 'required|date',
            'type' => 'nullable|string|max:50',
            'livre_id' => 'required|uuid|exists:livres,id',
            'quantite' => 'required|integer|min:0',
            'remise' => 'sometimes|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        $bVentesClient = BVentesClient::create($validatedData);
        return new BVentesClientResource($bVentesClient);
    }

    public function show($id)
    {
        $bVentesClient = BVentesClient::findOrFail($id);
        return new BVentesClientResource($bVentesClient);
    }

    public function update(Request $request, $id)
    {
        $bVentesClient = BVentesClient::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'client_id' => 'sometimes|uuid|exists:clients,id',
            'b_vente_number' => 'sometimes|string|max:50',
            'date_vente' => 'sometimes|date',
            'type' => 'nullable|string|max:50',
            'livre_id' => 'sometimes|uuid|exists:livres,id',
            'quantite' => 'sometimes|integer|min:0',
            'remise' => 'sometimes|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        $bVentesClient->update($validatedData);

        return new BVentesClientResource($bVentesClient);
    }

    public function destroy($id)
    {
        $bVentesClient = BVentesClient::findOrFail($id);
        $bVentesClient->delete();

        return response()->json(null, 204);
    }
}
