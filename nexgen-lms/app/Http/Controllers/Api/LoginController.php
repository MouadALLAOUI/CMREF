<?php

namespace App\Http\Controllers\Api;

use App\Events\RepresentantUpdated;
use App\Http\Controllers\Controller;
use App\Models\Login;
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
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Find the user in the central 'logins' table
        // We use 'with(profile)' to automatically pull Admin or Representant data
        $loginRecord = Login::with('profile')
            ->where('username', $request->username)
            ->first();

        // 3. Verify user existence and password
        if (!$loginRecord || !Hash::check($request->password, $loginRecord->password)) {
            throw ValidationException::withMessages([
                'username' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // 4. Check if account is active
        if (!$loginRecord->is_active) {
            return response()->json(['message' => 'Votre compte est désactivé.'], 403);
        }

        // 5. Update activity tracking
        $loginRecord->update([
            'is_online' => true,
            'last_visit' => now()
        ]);

        // 🔥 ADD THIS: If it's a representative, notify the admin dashboard
        if ($loginRecord->role === 'representant' && $loginRecord->profile) {
            event(new RepresentantUpdated($loginRecord->profile));
        }

        // 6. Generate the Sanctum Token
        $token = $loginRecord->createToken('auth_token')->plainTextToken;

        // 7. Structure the response for your React Zustand Store
        return response()->json([
            'status' => 'success',
            'token'  => $token,
            'user'   => [
                'username' => $loginRecord->username,
                'role'     => $loginRecord->role, // 'admin' or 'representant'
            ],
            // This is the polymorphic data (Admin table or Representant table)
            'profile' => $loginRecord->profile
        ]);
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

            if ($user->role === 'representant' && $user->profile) {
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
     * Active User Account
     */
    public function active_compte(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'is_active' => 'required|boolean',
        ]);
        $loginRecord = Login::with('profile')
            ->where('username', $request->username)
            ->first();

        if (!$loginRecord) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $loginRecord->update(['is_active' => $request->is_active]);

        if ($loginRecord->role === 'representant' && $loginRecord->profile) {
            event(new RepresentantUpdated($loginRecord->profile));
        }

        return response()->json(['message' => 'User account updated successfully']);
    }
}
