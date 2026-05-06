<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request)
    {
        // 1. This uses the logic inside your LoginRequest to attempt Auth::attempt()
        $request->authenticate();
        // 2. CRITICAL: This starts the session and creates the 'laravel_session' cookie.
        // This is what prevents the 401 error on the next request.
        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
            'message' => 'Authenticated successfully.'
        ]);
        // The user was set in the Auth context during authenticate()
        // $user = Auth::user();

        // if (!$user) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // // Generate the Sanctum token
        // $token = $user->createToken('auth_token')->plainTextToken;

        // // Set HttpOnly cookie
        // $cookie = Cookie::make(
        //     'access_token',
        //     $token,
        //     60 * 24, // 24 hours
        //     '/',
        //     null,
        //     false, // secure - set to true in production
        //     true,  // httpOnly
        //     false,
        //     'Lax'
        // );

        // return response()->json([
        //     'user' => $user,
        //     // Still returning token for backward compatibility or initial setup if needed, 
        //     // but the cookie is the primary auth method now.
        //     'access_token' => $token,
        //     'token_type' => 'Bearer',
        // ])->withCookie($cookie);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request)
    {
        // 1. Logs the user out of the web guard (session)
        Auth::guard('web')->logout();
        // 2. Invalidates the session and regenerates the CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
        // Revoke the token that was used to authenticate the current request
        // $request->user()->currentAccessToken()->delete();

        // // Clear the cookie
        // $cookie = Cookie::forget('access_token');

        // return response()->json([
        //     'message' => 'Successfully logged out'
        // ])->withCookie($cookie);
    }
}