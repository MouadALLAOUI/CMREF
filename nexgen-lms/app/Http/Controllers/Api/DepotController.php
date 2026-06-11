<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Depot;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

use App\Http\Resources\DepotResource;

class DepotController extends Controller
{
    public function index(Request $request)
    {
        $depots = Depot::with(['representant', 'livre'])->latest()->get();
        return DepotResource::collection($depots);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => [
                'required',
                'uuid',
                'exists:representants,id',
                Rule::unique('depots')->where(fn($query) => $query->where('livre_id', $request->livre_id))
            ],
            'livre_id' => 'required|uuid|exists:livres,id',
            'quantite_balance' => 'required|integer',
            'status' => 'required|in:Actif,Cloturé',
            'remarks' => 'nullable|string',
        ]);

        $depot = Depot::create($validatedData);
        return new DepotResource($depot);
    }

    public function show($id)
    {
        $depot = Depot::findOrFail($id);
        return new DepotResource($depot);
    }

    public function update(Request $request, $id)
    {
        $depot = Depot::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => [
                'sometimes',
                'uuid',
                'exists:representants,id',
                Rule::unique('depots')->where(fn($query) => $query->where('livre_id', $request->livre_id ?? $depot->livre_id))->ignore($depot->id)
            ],
            'livre_id' => 'sometimes|uuid|exists:livres,id',
            'quantite_balance' => 'sometimes|integer',
            'status' => 'sometimes|in:Actif,Cloturé',
            'remarks' => 'nullable|string',
        ]);

        // Prevent negative stock
        if (isset($validatedData['quantite_balance']) && $validatedData['quantite_balance'] < 0) {
            throw ValidationException::withMessages([
                'quantite_balance' => 'Stock balance cannot be negative.',
            ]);
        }

        $depot->update($validatedData);

        return new DepotResource($depot);
    }

    public function destroy($id)
    {
        $depot = Depot::findOrFail($id);
        $depot->delete();

        return response()->json(null, 204);
    }

    public function byRepresentant($id)
    {
        $depots = Depot::where('rep_id', $id)->with(['representant', 'livre'])->get();
        
        return DepotResource::collection($depots);
    }
}
