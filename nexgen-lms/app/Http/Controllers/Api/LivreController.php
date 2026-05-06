<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Livre;
use Illuminate\Http\Request;

use App\Http\Resources\LivreResource;

class LivreController extends Controller
{
    public function index()
    {
        $livres = Livre::with('category')->paginate(1000);
        return LivreResource::collection($livres);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:livres',
            'categorie_id' => 'required|uuid|exists:categories,id',
            'prix_achat' => 'required|numeric|min:0',
            'prix_vente' => 'required|numeric|min:0',
            'prix_public' => 'required|numeric|min:0',
            'nb_pages' => 'required|integer|min:0',
            'color_code' => 'sometimes|string|max:7',
            'description' => 'nullable|string',
            'annee_publication' => 'nullable|string|max:4',
        ]);

        $livre = Livre::create($validatedData);
        return new LivreResource($livre);
    }

    public function show($id)
    {
        $livre = Livre::findOrFail($id);
        return new LivreResource($livre);
    }

    public function update(Request $request, $id)
    {
        $livre = Livre::findOrFail($id);

        $validatedData = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:livres,code,' . $livre->id,
            'categorie_id' => 'sometimes|uuid|exists:categories,id',
            'prix_achat' => 'sometimes|numeric|min:0',
            'prix_vente' => 'sometimes|numeric|min:0',
            'prix_public' => 'sometimes|numeric|min:0',
            'nb_pages' => 'sometimes|integer|min:0',
            'color_code' => 'sometimes|string|max:7',
            'description' => 'nullable|string',
            'annee_publication' => 'nullable|string|max:4',
        ]);

        $livre->update($validatedData);

        return new LivreResource($livre);
    }

    public function destroy($id)
    {
        $livre = Livre::findOrFail($id);
        $livre->delete();

        return response()->json(null, 204);
    }
}
