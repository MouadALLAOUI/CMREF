<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientRemboursement;
use Illuminate\Http\Request;

use App\Http\Resources\ClientRemboursementResource;

class ClientRemboursementController extends Controller
{
    public function index()
    {
        $clientRemboursements = ClientRemboursement::with(['representant', 'client'])->paginate(1000);
        return ClientRemboursementResource::collection($clientRemboursements);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'client_id' => 'required|uuid|exists:clients,id',
            'date_payment' => 'required|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'banque_nom' => 'nullable|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'a_lordre_de' => 'nullable|string|max:255',
            'montant' => 'required|numeric|min:0',
            'observation' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $clientRemboursement = ClientRemboursement::create($validatedData);
        return new ClientRemboursementResource($clientRemboursement);
    }

    public function show($id)
    {
        $clientRemboursement = ClientRemboursement::findOrFail($id);
        return new ClientRemboursementResource($clientRemboursement);
    }

    public function update(Request $request, $id)
    {
        $clientRemboursement = ClientRemboursement::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'client_id' => 'sometimes|uuid|exists:clients,id',
            'date_payment' => 'sometimes|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'banque_nom' => 'nullable|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'a_lordre_de' => 'nullable|string|max:255',
            'montant' => 'sometimes|numeric|min:0',
            'observation' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $clientRemboursement->update($validatedData);

        return new ClientRemboursementResource($clientRemboursement);
    }

    public function destroy($id)
    {
        $clientRemboursement = ClientRemboursement::findOrFail($id);
        $clientRemboursement->delete();

        return response()->json(null, 204);
    }
}
