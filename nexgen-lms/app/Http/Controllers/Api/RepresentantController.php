<?php

namespace App\Http\Controllers\Api;

use App\Events\RepresentantUpdated;
use App\Http\Controllers\Controller;
use App\Models\Representant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Http\Resources\RepresentantResource;
use Illuminate\Support\Facades\DB;

class RepresentantController extends Controller
{
    public function index()
    {
        $representants = Representant::with(["login"])->paginate(1000);
        return RepresentantResource::collection($representants);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:representants',
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'tel' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:representants',
            'adresse' => 'nullable|string',
            'code_postale' => 'nullable|string|max:10',
            'ville' => 'nullable|string|max:100',
            'lieu_de_travail' => 'nullable|string|max:255',
            'bl_count' => 'sometimes|integer|min:0',
            'remb_count' => 'sometimes|integer|min:0',
            // Synchronize with Login table validation
            'login' => 'required|string|max:100|unique:logins,username',
            'password' => 'required|string|min:8',
        ]);


        try {
            $representant = DB::transaction(function () use ($validatedData) {
                $hashedPassword = Hash::make($validatedData['password']);
                // 1. Create Representant (contains password/login duplicate if you keep those columns)
                $data = $validatedData;
                $data['password'] = $hashedPassword;
                $representant = Representant::create($data);
                // 3. Create the central login record
                $representant->login()->create([
                    'username' => $validatedData['login'],
                    'password' => $hashedPassword,
                    'role' => 'representant',
                    'last_visit' => now(),
                ]);

                return $representant;
            });
            event(new RepresentantUpdated($representant));
            return new RepresentantResource($representant->load('login'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
        }

        // $representant = Representant::create($validatedData);
        // return new RepresentantResource($representant);
    }

    public function show($id)
    {
        $representant = Representant::findOrFail($id);
        return new RepresentantResource($representant);
    }

    public function update(Request $request, $id)
    {
        $representant = Representant::findOrFail($id);

        $validatedData = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'cin' => 'sometimes|string|max:20|unique:representants,cin,' . $representant->id,
            'destination_id' => 'nullable|uuid|exists:destinations,id',
            'tel' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:representants,email,' . $representant->id,
            'adresse' => 'nullable|string',
            'code_postale' => 'nullable|string|max:10',
            'ville' => 'nullable|string|max:100',
            'lieu_de_travail' => 'nullable|string|max:255',
            'login' => 'sometimes|string|max:100|unique:logins,username,' . $representant->id,
            'password' => 'sometimes|string|min:8', // Optional - only update if provided
            'bl_count' => 'sometimes|integer|min:0',
            'remb_count' => 'sometimes|integer|min:0',
            'last_online_at' => 'sometimes|nullable|date',
        ]);

        try {
            DB::transaction(function () use ($representant, $validatedData) {
                // Update Password if provided (allow empty to skip)
                if (isset($validatedData['password']) && !empty($validatedData['password'])) {
                    $validatedData['password'] = Hash::make($validatedData['password']);
                } else {
                    unset($validatedData['password']);
                }

                // 1. Update Representant Table
                $representant->update($validatedData);

                // 2. Sync with Login Table
                if ($representant->login) {
                    $loginUpdate = [];
                    if (isset($validatedData['login'])) $loginUpdate['username'] = $validatedData['login'];
                    if (isset($validatedData['password'])) $loginUpdate['password'] = $validatedData['password'];

                    if (!empty($loginUpdate)) {
                        $representant->login->update($loginUpdate);
                    }
                }
            });
            event(new RepresentantUpdated($representant));

            return new RepresentantResource($representant->load('login'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur de mise à jour', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $representant = Representant::findOrFail($id);
        
        $validated = $request->validate([
            'last_online_at' => 'nullable|date',
        ]);

        $representant->update($validated);
        event(new RepresentantUpdated($representant));

        return new RepresentantResource($representant->load('login'));
    }

    public function destroy($id)
    {
        $representant = Representant::findOrFail($id);

        DB::transaction(function () use ($representant) {
            $representant->login()->delete();
            $representant->delete();
        });
        event(new RepresentantUpdated($representant));

        return response()->json(null, 204);
    }
}
