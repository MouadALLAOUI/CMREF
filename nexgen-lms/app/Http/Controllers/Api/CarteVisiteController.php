<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarteVisite;
use Illuminate\Http\Request;

use App\Http\Resources\CarteVisiteResource;

class CarteVisiteController extends Controller
{
    public function index()
    {
        $carteVisites = CarteVisite::with('representant')
            ->where('is_deleted', false)
            ->latest()
            ->paginate(1000);
        return CarteVisiteResource::collection($carteVisites);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            // Identity & Dates
            'rep_id' => 'required|uuid|exists:representants,id',
            'date_commande' => 'required|date',
            'annee_scolaire' => 'nullable|string|max:20',
            'model' => 'nullable|string',

            // Card Content
            'nom_sur_carte' => 'required|string|max:255',
            'fonction' => 'nullable|string|max:255',
            'tel' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string',
            'autre_info' => 'nullable|string',
            'logo_path' => 'nullable|string',

            // Chevalet Content
            'chevalet_ligne_1' => 'nullable|string|max:255',
            'chevalet_ligne_2' => 'nullable|string|max:255',
            'chevalet_ligne_3' => 'nullable|string|max:255',

            // Design & Comments
            'conception_carte' => 'nullable|string',
            'conception_chevalet' => 'nullable|string',
            'comment_cv' => 'nullable|string',
            'comment_chevalet' => 'nullable|string',
            'remarques' => 'nullable|string',

            // Initial Status Flags
            'is_valide_carte' => 'boolean',
            'is_valide_chevalet' => 'boolean',
            'prod_carte' => 'boolean',
            'prod_chevalet' => 'boolean',
            'livraison_carte' => 'boolean',
            'livraison_chevalet' => 'boolean',
            'recu_carte' => 'boolean',
            'recu_chevalet' => 'boolean',
        ]);

        $carteVisite = CarteVisite::create($validatedData);
        return new CarteVisiteResource($carteVisite);
    }

    public function show($id)
    {
        $carteVisite = CarteVisite::findOrFail($id)->where('is_deleted', false);
        return new CarteVisiteResource($carteVisite);
    }

    public function update(Request $request, $id)
    {
        $carteVisite = CarteVisite::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'date_commande' => 'sometimes|date',
            'annee_scolaire' => 'nullable|string|max:20',
            'model' => 'nullable|string',

            'nom_sur_carte' => 'sometimes|string|max:255',
            'fonction' => 'nullable|string|max:255',
            'tel' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string',
            'autre_info' => 'nullable|string',
            'logo_path' => 'nullable|string',

            'chevalet_ligne_1' => 'nullable|string|max:255',
            'chevalet_ligne_2' => 'nullable|string|max:255',
            'chevalet_ligne_3' => 'nullable|string|max:255',

            'conception_carte' => 'nullable|string',
            'conception_chevalet' => 'nullable|string',
            'comment_cv' => 'nullable|string',
            'comment_chevalet' => 'nullable|string',
            'remarques' => 'nullable|string',

            'is_valide_carte' => 'sometimes|boolean',
            'is_valide_chevalet' => 'sometimes|boolean',
            'prod_carte' => 'sometimes|boolean',
            'prod_chevalet' => 'sometimes|boolean',
            'livraison_carte' => 'sometimes|boolean',
            'livraison_chevalet' => 'sometimes|boolean',
            'recu_carte' => 'sometimes|boolean',
            'recu_chevalet' => 'sometimes|boolean',
            'is_deleted' => 'sometimes|boolean',
        ]);

        $carteVisite->update($validatedData);

        return new CarteVisiteResource($carteVisite);
    }

    public function destroy($id)
    {
        $carteVisite = CarteVisite::findOrFail($id);
        $carteVisite->update(['is_deleted' => true]);
        return response()->json(['message' => 'Marqué supprimé'], 200);
    }
}
