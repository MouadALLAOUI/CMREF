<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catalogue;
use Illuminate\Http\Request;

use App\Http\Resources\CatalogueResource;

class CatalogueController extends Controller
{
    public function index(Request $request)
    {
        $query = Catalogue::with('category');

        if ($request->has('page')) {
            $perPage = min((int) $request->query('per_page', 15), 100);
            $paginator = $query->latest()->paginate($perPage);
            return response()->json([
                'data' => CatalogueResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        }

        $catalogues = $query->paginate(1000);
        return CatalogueResource::collection($catalogues);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'categorie_id' => 'required|uuid|exists:categories,id',
            'image_url' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $catalogue = Catalogue::create($validatedData);
        return new CatalogueResource($catalogue);
    }

    public function show($id)
    {
        $catalogue = Catalogue::findOrFail($id);
        return new CatalogueResource($catalogue);
    }

    public function update(Request $request, $id)
    {
        $catalogue = Catalogue::findOrFail($id);

        $validatedData = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'categorie_id' => 'sometimes|uuid|exists:categories,id',
            'image_url' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $catalogue->update($validatedData);

        return new CatalogueResource($catalogue);
    }

    public function destroy($id)
    {
        $catalogue = Catalogue::findOrFail($id);
        $catalogue->delete();

        return response()->json(null, 204);
    }
}
