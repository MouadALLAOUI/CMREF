<?php

namespace App\Http\Controllers\Api;

use App\Events\RepresentantUpdated;
use App\Http\Controllers\Controller;
use App\Models\Login;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle the unified login request.
     */
    public function login(Request $request)
    {
        // 1. Validate the incoming request
        $request->validate([
            'annee' => 'required|string',
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $season = Season::where('name', $request->annee)->first();
        if (!$season || !$season->is_active) {
            throw ValidationException::withMessages([
                'login' => ['Ces identifiants sont incorrects ou la période sélectionnée est clôturée.'],
            ]);
        }

        // 2. Find the user in the central 'logins' table
        // We use 'with(profile)' to automatically pull Admin or Representant data
        $loginRecord = Login::with('profile')
            ->where('username', $request->username)
            ->first();

        // 3. Verify user existence and password
        if (!$loginRecord || !Hash::check($request->password, $loginRecord->password)) {
            throw ValidationException::withMessages([
                'login' => ['Les identifiants fournis sont incorrects ou la période sélectionnée est clôturée.'],
            ]);
        }

        // 4. Check account access
        // Admins: use is_active from logins table
        // Representants: use season status from representant_season pivot
        $accessLevel = null;
        if ($loginRecord->role === 'representant') {
            $representant = $loginRecord->profile;
            if ($representant && $season) {
                $seasonStatus = $representant->seasonStatuses()
                    ->where('season_id', $season->id)
                    ->first();
                if ($seasonStatus && $seasonStatus->status === 'disabled') {
                    return response()->json(['message' => 'Votre accès à cette saison est désactivé.'], 403);
                }
                $accessLevel = $seasonStatus?->status ?? 'unlock';
            }
        } elseif (!$loginRecord->is_active) {
            return response()->json(['message' => 'Votre compte est désactivé.'], 403);
        }

        // 5. Update activity tracking
        $loginRecord->update([
            'is_online' => true,
            'last_visit' => now()
        ]);

        // 🔥 ADD THIS: If it's a representative, notify the admin dashboard
        if ($loginRecord->role === 'representant' && $loginRecord->profile && config('broadcasting.reverb_trigger')) {
            event(new RepresentantUpdated($loginRecord->profile));
        }

        // 6. Generate the Sanctum Token
        $token = $loginRecord->createToken('auth_token')->plainTextToken;

        // 7. Structure the response for your React Zustand Store
        $response = [
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'username' => $loginRecord->username,
                'role'     => $loginRecord->role, // 'admin' or 'representant'
            ],
            'annee' => $request->annee,
            // This is the polymorphic data (Admin table or Representant table)
            'profile' => $loginRecord->profile,
            'reverb_trigger' => config('broadcasting.reverb_trigger'),
        ];

        if ($accessLevel) {
            $response['access_level'] = $accessLevel;
        }

        return response()->json($response);
    }

    /**
     * Log the user out (Revoke token).
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->load('profile');

            $user->update(['is_online' => false]);

            if ($user->role === 'representant' && $user->profile && config('broadcasting.reverb_trigger')) {
                event(new \App\Events\RepresentantUpdated($user->profile));
            }

            $user->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Déconnecté',
            ]);
        }

        return response()->json(['message' => 'User not found'], 404);
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $loginRecord = $request->user();

        if (!Hash::check($request->current_password, $loginRecord->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $loginRecord->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès.'
        ]);
    }
}