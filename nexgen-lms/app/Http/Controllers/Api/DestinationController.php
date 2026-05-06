<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::with(['representants', 'ventes', 'livraisons'])->paginate(1000);
        return DestinationResource::collection($destinations);
    }



    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'destination' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $Destination = Destination::create($validatedData);
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

        return new DestinationResource($Destination);
    }

    public function destroy($id)
    {
        $Destination = Destination::findOrFail($id);
        $Destination->delete();

        return response()->json(null, 204);
    }
}
