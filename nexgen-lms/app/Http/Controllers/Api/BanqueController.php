<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

use App\Http\Resources\BanqueResource;

class BanqueController extends Controller
{
    private const CACHE_KEY = 'banques_all';
    private const CACHE_TTL = 3600; // 1 hour

    public function index()
    {
        $banques = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Banque::orderBy('nom', 'asc')->get();
        });

        return BanqueResource::collection($banques);
    }

    public function show($id)
    {
        $banque = Banque::findOrFail($id);
        return new BanqueResource($banque);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:banques,nom',
            'code_abreviation' => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        try {
            $banque = Banque::create($validated);
            Cache::forget(self::CACHE_KEY);
            return response()->json(new BanqueResource($banque), 201);
        } catch (\Exception $e) {
            Log::error("Erreur création banque: " . $e->getMessage());
            return response()->json(['message' => "Erreur lors de l'enregistrement"], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $banque = Banque::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100|unique:banques,nom,' . $id,
            'code_abreviation' => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        $banque->update($validated);
        Cache::forget(self::CACHE_KEY);
        return new BanqueResource($banque);
    }

    public function destroy($id)
    {
        $banque = Banque::findOrFail($id);
        $banque->delete();
        Cache::forget(self::CACHE_KEY);
        return response()->json(null, 204);
    }
}
