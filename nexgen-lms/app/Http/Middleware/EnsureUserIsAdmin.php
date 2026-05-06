<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Perform your check
        if ($request->user() && $request->user()->role !== 'admin') {
            // 2. If they fail the check, block them
            return response()->json(['message' => 'Access Denied: Admins Only.'], 403);
        }

        // 3. If they pass, let the request continue to the Controller
        return $next($request);
    }
}