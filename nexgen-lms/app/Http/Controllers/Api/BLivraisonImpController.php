<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BLivraisonImp;
use Illuminate\Http\Request;

use App\Http\Resources\BLivraisonImpResource;
use Illuminate\Support\Facades\DB;

class BLivraisonImpController extends Controller
{
    public function index()
    {
        $bLivraisonImps = BLivraisonImp::with(['imprimeur', 'items.livre'])->latest()->get();
        return BLivraisonImpResource::collection($bLivraisonImps);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'imprimeur_id'       => 'required|uuid|exists:imprimeurs,id',
            'date_reception'     => 'required|date',
            'b_livraison_number' => 'required|string|max:50',
            'remarks'            => 'nullable|string',
            'annee'            => 'nullable|string',
            'details'            => 'required|array|min:1',
            'details.*.livre_id' => 'required|uuid|exists:livres,id',
            'details.*.qte'      => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validatedData) {
            $bLivraison = BLivraisonImp::create([
                'imprimeur_id'       => $validatedData['imprimeur_id'],
                'date_reception'     => $validatedData['date_reception'],
                'b_livraison_number' => $validatedData['b_livraison_number'],
                'annee' => $validatedData['annee'],
                'remarks'            => $validatedData['remarks'],
            ]);

            foreach ($validatedData['details'] as $item) {
                $bLivraison->items()->create([
                    'livre_id' => $item['livre_id'],
                    'quantite' => $item['qte'],
                    // 'deliverable_type' is handled automatically by morphMany
                ]);
            }

            return new BLivraisonImpResource($bLivraison->load('items.livre', 'imprimeur'));
        });
    }

    public function show($id)
    {
        $bLivraisonImp = BLivraisonImp::findOrFail($id);
        return new BLivraisonImpResource($bLivraisonImp);
    }

    public function update(Request $request, $id)
    {
        $bLivraisonImp = BLivraisonImp::findOrFail($id);

        $validatedData = $request->validate([
            'imprimeur_id' => 'sometimes|uuid|exists:imprimeurs,id',
            'date_reception' => 'sometimes|date',
            'b_livraison_number' => 'sometimes|string|max:50',
            'livre_id' => 'sometimes|uuid|exists:livres,id',
            'quantite' => 'sometimes|integer|min:0',
            'remarks' => 'nullable|string',
        ]);

        $bLivraisonImp->update($validatedData);

        return new BLivraisonImpResource($bLivraisonImp);
    }

    public function destroy($id)
    {
        $bLivraisonImp = BLivraisonImp::findOrFail($id);
        $bLivraisonImp->delete();

        return response()->json(null, 204);
    }

    public function destroyGroup($id)
    {
        $bl = BLivraisonImp::findOrFail($id);
        return DB::transaction(function () use ($bl) {
            // Delete related items first if not using database cascade
            $bl->items()->delete();
            $bl->delete();
            return response()->json(['message' => "BL supprimé"]);
        });
    }
}
