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
    public function index(Request $request)
    {
        $representants = Representant::with(["loginRecord"])->latest()->get();
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
                // 1. Create Representant (without password - Login is source of truth)
                $data = collect($validatedData)->except('password')->toArray();
                $representant = Representant::create($data);
                // 2. Create the central login record
                $representant->loginRecord()->create([
                    'username' => $validatedData['login'],
                    'password' => $hashedPassword,
                    'role' => 'representant',
                    'last_visit' => now(),
                ]);

                return $representant;
            });
            if (config('broadcasting.reverb_trigger')) {
                event(new RepresentantUpdated($representant));
            }
            return new RepresentantResource($representant->load('loginRecord'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur serveur', 'error' => $e->getMessage()], 500);
        }
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
                // 1. Update Representant Table (without password)
                $representant->update(collect($validatedData)->except('password')->toArray());

                // 2. Sync password with Login Table if provided
                if (isset($validatedData['password']) && !empty($validatedData['password']) && $representant->loginRecord) {
                    $representant->loginRecord->update([
                        'password' => Hash::make($validatedData['password']),
                    ]);
                }

                // 3. Sync login username with Login Table if provided
                if (isset($validatedData['login']) && $representant->loginRecord) {
                    $representant->loginRecord->update([
                        'username' => $validatedData['login'],
                    ]);
                }
            });
            if (config('broadcasting.reverb_trigger')) {
                event(new RepresentantUpdated($representant));
            }

            return new RepresentantResource($representant->load('loginRecord'));
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
        if (config('broadcasting.reverb_trigger')) {
            event(new RepresentantUpdated($representant));
        }

        return new RepresentantResource($representant->load('loginRecord'));
    }

    public function destroy($id)
    {
        $representant = Representant::findOrFail($id);

        DB::transaction(function () use ($representant) {
            $representant->loginRecord()->delete();
            $representant->delete();
        });
        if (config('broadcasting.reverb_trigger')) {
            event(new RepresentantUpdated($representant));
        }

        return response()->json(null, 204);
    }
}
