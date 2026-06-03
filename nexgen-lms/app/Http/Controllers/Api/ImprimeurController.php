<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Imprimeur;
use Illuminate\Http\Request;

use App\Http\Resources\ImprimeurResource;

class ImprimeurController extends Controller
{
    public function index(Request $request)
    {
        $query = Imprimeur::query();

        if ($request->has('page')) {
            $perPage = min((int) $request->query('per_page', 15), 100);
            $paginator = $query->latest()->paginate($perPage);
            return response()->json([
                'data' => ImprimeurResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        }

        $imprimeurs = $query->paginate(1000);
        return ImprimeurResource::collection($imprimeurs);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'raison_sociale' => 'required|string|max:255',
            'adresse' => 'nullable|string',
            'directeur_nom' => 'nullable|string|max:255',
            'directeur_tel' => 'nullable|string|max:20',
            'directeur_email' => 'nullable|string|email|max:255',
            'adjoint_nom' => 'nullable|string|max:255',
            'adjoint_tel' => 'nullable|string|max:20',
            'adjoint_email' => 'nullable|string|email|max:255',
        ]);

        $imprimeur = Imprimeur::create($validatedData);
        return new ImprimeurResource($imprimeur);
    }

    public function show($id)
    {
        $imprimeur = Imprimeur::findOrFail($id);
        return new ImprimeurResource($imprimeur);
    }

    public function update(Request $request, $id)
    {
        $imprimeur = Imprimeur::findOrFail($id);

        $validatedData = $request->validate([
            'raison_sociale' => 'sometimes|string|max:255',
            'adresse' => 'nullable|string',
            'directeur_nom' => 'nullable|string|max:255',
            'directeur_tel' => 'nullable|string|max:20',
            'directeur_email' => 'nullable|string|email|max:255',
            'adjoint_nom' => 'nullable|string|max:255',
            'adjoint_tel' => 'nullable|string|max:20',
            'adjoint_email' => 'nullable|string|email|max:255',
        ]);

        $imprimeur->update($validatedData);

        return new ImprimeurResource($imprimeur);
    }

    public function destroy($id)
    {
        $imprimeur = Imprimeur::findOrFail($id);
        $imprimeur->delete();

        return response()->json(null, 204);
    }
}
