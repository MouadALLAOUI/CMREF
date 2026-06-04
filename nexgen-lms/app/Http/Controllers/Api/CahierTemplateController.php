<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CahierTemplateResource;
use App\Models\CahierTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CahierTemplateController extends Controller
{
    private const CACHE_KEY = 'cahier_templates_all';
    private const CACHE_TTL = 3600;

    public function index()
    {
        $templates = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return CahierTemplate::orderBy('nom', 'asc')->get();
        });
        return CahierTemplateResource::collection($templates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contenu' => 'required|string',
            'variables' => 'nullable|string',
            'est_actif' => 'sometimes|boolean',
        ]);

        $template = CahierTemplate::create($validated);
        Cache::forget(self::CACHE_KEY);
        return response()->json(new CahierTemplateResource($template), 201);
    }

    public function show($id)
    {
        $template = CahierTemplate::findOrFail($id);
        return new CahierTemplateResource($template);
    }

    public function update(Request $request, $id)
    {
        $template = CahierTemplate::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'contenu' => 'sometimes|string',
            'variables' => 'nullable|string',
            'est_actif' => 'sometimes|boolean',
        ]);

        $template->update($validated);
        Cache::forget(self::CACHE_KEY);
        return new CahierTemplateResource($template);
    }

    public function destroy($id)
    {
        $template = CahierTemplate::findOrFail($id);
        $template->delete();
        Cache::forget(self::CACHE_KEY);
        return response()->json(null, 204);
    }
}
