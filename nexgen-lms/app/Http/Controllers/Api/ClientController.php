<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

use App\Http\Resources\ClientResource;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('representant')->paginate(1000);
        return ClientResource::collection($clients);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'representant_id' => 'required|uuid|exists:representants,id',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'raison_sociale' => 'required|string|max:255',
            'ville' => 'nullable|string|max:100',
            'adresse' => 'nullable|string',
            'tel' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
        ]);

        $client = Client::create($validatedData);
        return new ClientResource($client);
    }

    public function show($id)
    {
        $client = Client::findOrFail($id);
        return new ClientResource($client);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validatedData = $request->validate([
            'representant_id' => 'sometimes|uuid|exists:representants,id',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'raison_sociale' => 'sometimes|string|max:255',
            'ville' => 'nullable|string|max:100',
            'adresse' => 'nullable|string',
            'tel' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
        ]);

        $client->update($validatedData);

        return new ClientResource($client);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(null, 204);
    }
}
