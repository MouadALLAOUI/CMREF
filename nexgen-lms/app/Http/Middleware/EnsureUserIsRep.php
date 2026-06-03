<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsRep
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role !== 'representant') {
            return response()->json(['message' => 'Access Denied: Representatives Only.'], 403);
        }

        return $next($request);
    }
}
