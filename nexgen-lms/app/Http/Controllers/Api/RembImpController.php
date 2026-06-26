<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RembImp;
use Illuminate\Http\Request;

use App\Http\Resources\RembImpResource;

class RembImpController extends Controller
{
    public function index(Request $request)
    {
        $rembImps = RembImp::with('imprimeur')->with('banque')->with('representant')->latest()->get();

        return RembImpResource::collection($rembImps);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'imprimeur_id' => 'required|uuid|exists:imprimeurs,id',
            'rep_id' => 'nullable|uuid|exists:representants,id',
            'date_payment' => 'required|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'banque_nom' => 'nullable|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'montant' => 'required|numeric|min:0',
            'statut_recu' => 'sometimes|boolean',
            'statut_rejete' => 'sometimes|boolean',
            'statut_retourne' => 'sometimes|boolean',
            'date_retour' => 'nullable|date',
            'motif_retour' => 'nullable|string|max:500',
            'remarks' => 'nullable|string',
        ]);

        $rembImp = RembImp::create($validatedData);
        return new RembImpResource($rembImp);
    }

    public function show($id)
    {
        $rembImp = RembImp::findOrFail($id);
        return new RembImpResource($rembImp);
    }

    public function update(Request $request, $id)
    {
        $rembImp = RembImp::findOrFail($id);

        $validatedData = $request->validate([
            'imprimeur_id' => 'sometimes|uuid|exists:imprimeurs,id',
            'rep_id' => 'nullable|uuid|exists:representants,id',
            'date_payment' => 'sometimes|date',
            'banque_id' => 'nullable|uuid|exists:banques,id',
            'banque_nom' => 'nullable|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'cheque_image_path' => 'nullable|string',
            'montant' => 'sometimes|numeric|min:0',
            'statut_recu' => 'sometimes|boolean',
            'statut_rejete' => 'sometimes|boolean',
            'statut_retourne' => 'sometimes|boolean',
            'date_retour' => 'nullable|date',
            'motif_retour' => 'nullable|string|max:500',
            'remarks' => 'nullable|string',
        ]);

        $rembImp->update($validatedData);

        return new RembImpResource($rembImp);
    }

    public function destroy($id)
    {
        $rembImp = RembImp::findOrFail($id);
        $rembImp->delete();

        return response()->json(null, 204);
    }
}
