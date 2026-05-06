<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BLivraison;
use Illuminate\Http\Request;

use App\Http\Resources\BLivraisonResource;
use Illuminate\Support\Facades\DB;

class BLivraisonController extends Controller
{
    public function index()
    {
        $bLivraisons = BLivraison::with(['representant', 'items.livre'])
            ->latest()
            ->get();
        return BLivraisonResource::collection($bLivraisons);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'bl_number' => 'required|string|max:50',
            'date_emission' => 'required|date',
            'mode_envoi' => 'nullable|string',
            'type' => 'required|in:Livre,Specimen,Pedagogie,Retour',
            'annee' => 'nullable|string',
            'details' => 'required|array|min:1', // Ensure at least one book is selected
            'details.*.livre_id' => 'required|uuid|exists:livres,id',
            'details.*.qte' => 'required|integer',
        ]);

        try {
            $result = DB::transaction(function () use ($validatedData) {
                // 1. Create the Header
                $bLivraison = BLivraison::create([
                    'rep_id' => $validatedData['rep_id'],
                    'bl_number' => $validatedData['bl_number'],
                    'date_emission' => $validatedData['date_emission'],
                    'mode_envoi' => $validatedData['mode_envoi'],
                    'type' => $validatedData['type'],
                    'annee' => $validatedData['annee'],
                    'status' => 'Pending',
                ]);

                // 2. Create all Items linked to this BL
                foreach ($validatedData['details'] as $item) {
                    $bLivraison->items()->create([
                        'livre_id' => $item['livre_id'],
                        'quantite' => $item['qte'],
                    ]);
                }

                return $bLivraison;
            });

            return new BLivraisonResource($result->load('items.livre', 'representant'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la création du BL', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $bLivraison = BLivraison::findOrFail($id);
        return new BLivraisonResource($bLivraison);
    }

    public function update(Request $request, $id)
    {
        $bLivraison = BLivraison::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'uuid|exists:representants,id',
            'bl_number' => 'string|max:50',
            'date_emission' => 'date',
            'mode_envoi' => 'nullable|string',
            'type' => 'in:Livre,Specimen,Pedagogie,Retour',
            'annee' => 'nullable|string',
            'statut_recu' => 'sometimes|boolean',
            'statut_vu' => 'sometimes|boolean',
            'status' => 'nullable|in:Pending,Seen,Received',
            'remarks' => 'nullable|string',
        ]);

        $bLivraison->update($validatedData);

        return new BLivraisonResource($bLivraison);
    }

    public function destroy($id)
    {
        $bLivraison = BLivraison::findOrFail($id);

        return DB::transaction(function () use ($bLivraison) {
            // Delete related items first if not using database cascade
            $bLivraison->items()->delete();
            $bLivraison->delete();
            return response()->json(['message' => "BL supprimé"]);
        });
    }
}
