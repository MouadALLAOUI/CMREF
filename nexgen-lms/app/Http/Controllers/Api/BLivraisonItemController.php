<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BLivraisonItem;
use Illuminate\Http\Request;

use App\Http\Resources\BLivraisonItemResource;
use App\Models\BLivraison;
use App\Models\BLivraisonImp;

class BLivraisonItemController extends Controller
{
    public function index()
    {
        $bLivraisonItems = BLivraisonItem::with(['deliverable', 'livre'])->paginate(1000);
        return BLivraisonItemResource::collection($bLivraisonItems);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'bl_id'    => 'required|uuid',
            'type'     => 'required|in:rep,imp', // Identify which BL table
            'livre_id' => 'required|uuid|exists:livres,id',
            'quantite' => 'required|integer|min:1',
        ]);

        // Map the short type to the actual Model Class
        $map = [
            'rep'   => BLivraison::class,
            'imp'   => BLivraisonImp::class,
        ];

        $item = BLivraisonItem::create([
            'deliverable_id'   => $validatedData['bl_id'],
            'deliverable_type' => $map[$validatedData['type']],
            'livre_id'         => $validatedData['livre_id'],
            'quantite'         => $validatedData['quantite'],
        ]);

        return new BLivraisonItemResource($item);
    }

    public function show($id)
    {
        $items = BLivraisonItem::where('deliverable_id', $id)
            ->with(['deliverable', 'livre']) // Eager load book details (titre, category, etc.)
            ->get();

        if ($items->isEmpty()) {
            return response()->json(['data' => []]);
        }

        // Return as a collection through the Resource
        return BLivraisonItemResource::collection($items);
    }

    public function update(Request $request, $id)
    {
        $bLivraisonItem = BLivraisonItem::findOrFail($id);

        $validatedData = $request->validate([
            'livre_id' => 'sometimes|uuid|exists:livres,id',
            'quantite' => 'sometimes|integer',
        ]);

        $bLivraisonItem->update($validatedData);

        return new BLivraisonItemResource($bLivraisonItem->load('deliverable', 'livre'));
    }

    public function destroy($id)
    {
        $bLivraisonItem = BLivraisonItem::findOrFail($id);
        $bLivraisonItem->delete();

        return response()->json(null, 204);
    }
}
