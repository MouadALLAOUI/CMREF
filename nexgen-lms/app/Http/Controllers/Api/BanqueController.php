<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Http\Resources\BanqueRequest;

class BanqueController extends Controller
{
    /**
     * Display a listing of the banks.
     */
    public function index()
    {
        // Return all banks, ordered by name
        return response()->json(Banque::orderBy('nom', 'asc')->get());
    }

    public function show($id)
    {
        $banque = Banque::findOrFail($id);
        return new BanqueRequest($banque);
    }

    /**
     * Store a newly created bank.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:banques,nom',
            'code_abreviation' => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        try {
            $banque = Banque::create($validated);
            return response()->json($banque, 201);
        } catch (\Exception $e) {
            Log::error("Erreur création banque: " . $e->getMessage());
            return response()->json(['message' => "Erreur lors de l'enregistrement"], 500);
        }
    }

    /**
     * Update the specified bank.
     */
    public function update(Request $request, $id)
    {
        $banque = Banque::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100|unique:banques,nom,' . $id,
            'code_abreviation' => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        $banque->update($validated);
        return response()->json($banque);
    }

    /**
     * Remove the specified bank.
     */
    public function destroy($id)
    {
        $banque = Banque::findOrFail($id);

        // Check if bank is linked to any payments before deleting
        // $hasPayments = \App\Models\RembImp::where('banque_id', $id)->exists();
        // if ($hasPayments) return response()->json(['message' => 'Impossible de supprimer une banque liée à des paiements'], 422);

        $banque->delete();
        return response()->json(null, 204);
    }
}