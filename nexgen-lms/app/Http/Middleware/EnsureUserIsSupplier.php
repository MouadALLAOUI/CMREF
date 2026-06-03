<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSupplier
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role !== 'supplier') {
            return response()->json(['message' => 'Access Denied: Suppliers Only.'], 403);
        }

        return $next($request);
    }
}
