<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DestinationController extends Controller
{
    private const CACHE_KEY = 'destinations_all';
    private const CACHE_TTL = 3600;

    public function index(Request $request)
    {
        if ($request->has('page')) {
            $query = Destination::with(['representants', 'ventes', 'livraisons']);
            $perPage = min((int) $request->query('per_page', 15), 100);
            $paginator = $query->latest()->paginate($perPage);
            return response()->json([
                'data' => DestinationResource::collection($paginator->items()),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ]);
        }

        $destinations = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Destination::with(['representants', 'ventes', 'livraisons'])->get();
        });

        return DestinationResource::collection($destinations);
    }



    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'destination' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $Destination = Destination::create($validatedData);
        Cache::forget(self::CACHE_KEY);
        return new DestinationResource($Destination);
    }

    public function show($id)
    {
        $Destination = Destination::findOrFail($id);
        return new DestinationResource($Destination);
    }

    public function update(Request $request, $id)
    {
        $Destination = Destination::findOrFail($id);

        $validatedData = $request->validate([
            'destination' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $Destination->update($validatedData);
        Cache::forget(self::CACHE_KEY);

        return new DestinationResource($Destination);
    }

    public function destroy($id)
    {
        $Destination = Destination::findOrFail($id);
        $Destination->delete();
        Cache::forget(self::CACHE_KEY);

        return response()->json(null, 204);
    }
}
