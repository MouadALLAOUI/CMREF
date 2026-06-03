<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\InvitationMail;
use App\Models\EmailLog;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InvitationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:représentant,fournisseur,admin',
            'message' => 'nullable|string',
        ]);

        try {
            $token = Invitation::generateToken();

            $invitation = Invitation::create([
                'email' => $validated['email'],
                'role' => $validated['role'],
                'message' => $validated['message'] ?? null,
                'token' => $token,
                'expires_at' => now()->addDays(7),
                'statut' => 'en attente',
                'emetteur_type' => get_class($request->user()),
                'emetteur_id' => $request->user()->id,
            ]);

            Mail::to($validated['email'])->send(
                new InvitationMail($validated['role'], $token, $validated['message'] ?? null)
            );

            EmailLog::create([
                'destinataire' => $validated['email'],
                'sujet' => "Invitation à rejoindre CMREF - " . ucfirst($validated['role']),
                'message' => $validated['message'] ?? "Invitation en tant que {$validated['role']}",
                'type' => 'invitation',
                'statut' => 'envoyé',
                'emetteur_type' => get_class($request->user()),
                'emetteur_id' => $request->user()->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Invitation envoyée avec succès.',
                'data' => [
                    'id' => $invitation->id,
                    'email' => $invitation->email,
                    'role' => $invitation->role,
                    'expires_at' => $invitation->expires_at,
                ],
            ]);
        } catch (\Exception $e) {
            EmailLog::create([
                'destinataire' => $validated['email'],
                'sujet' => "Invitation à rejoindre CMREF - " . ucfirst($validated['role']),
                'message' => $validated['message'] ?? "Invitation en tant que {$validated['role']}",
                'type' => 'invitation',
                'statut' => 'échoué',
                'emetteur_type' => get_class($request->user()),
                'emetteur_id' => $request->user()->id,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'envoi de l\'invitation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $invitations = Invitation::orderBy('created_at', 'desc')
            ->paginate(25);

        return response()->json($invitations);
    }

    public function accept(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        $invitation = Invitation::where('token', $validated['token'])
            ->actives()
            ->first();

        if (!$invitation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invitation invalide ou expirée.',
            ], 404);
        }

        $invitation->update([
            'accepted_at' => now(),
            'statut' => 'acceptée',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Invitation acceptée.',
            'data' => [
                'email' => $invitation->email,
                'role' => $invitation->role,
            ],
        ]);
    }
}
