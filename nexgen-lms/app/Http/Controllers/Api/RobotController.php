<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Robot;
use Illuminate\Http\Request;

use App\Http\Resources\RobotResource;

class RobotController extends Controller
{
    public function index()
    {
        $robots = Robot::with('representant')->paginate(1000);
        return RobotResource::collection($robots);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'rep_id' => 'required|uuid|exists:representants,id',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'date_operation' => 'required|date',
            'ville' => 'required|string|max:100',
            'etablissement' => 'required|string',
            'contact_nom' => 'required|string|max:150',
            'contact_tel' => 'required|string|max:50',
            'reference_robot' => 'required|string|max:100',
            'quantite_vue' => 'sometimes|integer|min:0',
            'quantite_recue' => 'sometimes|integer|min:0',
            'images' => 'nullable|array',
            'statut' => 'sometimes|in:Placé,En Démonstration,Retourné,Vendu',
            'remarques' => 'nullable|string',
        ]);

        $robot = Robot::create($validatedData);
        return new RobotResource($robot);
    }

    public function show($id)
    {
        $robot = Robot::findOrFail($id);
        return new RobotResource($robot);
    }

    public function update(Request $request, $id)
    {
        $robot = Robot::findOrFail($id);

        $validatedData = $request->validate([
            'rep_id' => 'sometimes|uuid|exists:representants,id',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'date_operation' => 'sometimes|date',
            'ville' => 'sometimes|string|max:100',
            'etablissement' => 'sometimes|string',
            'contact_nom' => 'sometimes|string|max:150',
            'contact_tel' => 'sometimes|string|max:50',
            'reference_robot' => 'sometimes|string|max:100',
            'quantite_vue' => 'sometimes|integer|min:0',
            'quantite_recue' => 'sometimes|integer|min:0',
            'images' => 'nullable|array',
            'statut' => 'sometimes|in:Placé,En Démonstration,Retourné,Vendu',
            'remarques' => 'nullable|string',
        ]);

        $robot->update($validatedData);

        return new RobotResource($robot);
    }

    public function destroy($id)
    {
        $robot = Robot::findOrFail($id);
        $robot->delete();

        return response()->json(null, 204);
    }
}
