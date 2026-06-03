<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendEmailJob;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        SendEmailJob::dispatch(
            $validated['to'],
            $validated['subject'],
            $validated['message'],
            $request->user()->id,
            get_class($request->user()),
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Email en cours d\'envoi.',
            'data' => $validated,
        ]);
    }

    public function history(Request $request)
    {
        $logs = \App\Models\EmailLog::orderBy('created_at', 'desc')
            ->paginate(25);

        return response()->json($logs);
    }
}
