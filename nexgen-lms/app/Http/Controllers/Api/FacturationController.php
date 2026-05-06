<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeF;
use App\Models\DetFact;
use App\Models\Fact;
use App\Models\FactSequence;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\FactResource;
use Illuminate\Support\Str;

class FacturationController extends Controller
{
    /**
     * Transform a billing request (DemandeF) into an invoice (Fact)
     */
    public function transform($id)
    {
        $demande = DemandeF::findOrFail($id);

        // Safety check: already transformed?
        if ($demande->livree) {
            return response()->json(['message' => 'Cette demande a déjà été transformée en facture.'], 422);
        }

        return DB::transaction(function () use ($demande) {
            // 1. Get current session (using school year from demande or default)
            $session = $demande->annee_scolaire ?? date('Y') . '-' . (date('Y') + 1);

            // 2. Generate next number from sequence
            // Note: FactSequence::getNextNumber should return the raw integer
            $nextNumber = FactSequence::getNextNumber($session);

            // Generate professional fact_number: FACT/26-27/0001
            $shortSession = substr($session, 2, 2) . '-' . substr($session, 7, 2);
            $factNumber = "FACT/{$shortSession}/" . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            // 3. Create the Invoice (Fact)
            // We need a sequence_id. Let's find one for the session or use a default.
            $sequence = FactSequence::firstOrCreate(['nom' => $session]);

            $fact = Fact::create([
                'id' => (string) Str::uuid(),
                'rep_id' => $demande->rep_id,
                'sequence_id' => $sequence->id,
                'demande_id' => $demande->id,
                'year_session' => $session,
                'number' => $nextNumber,
                'fact_number' => $factNumber,
                'date_facture' => now()->format('Y-m-d'),
                'total_ht' => 0, // Will be updated after adding details
                'tva_rate' => 20.00,
                'total_ttc' => 0,
                'status' => 'Brouillon',
                'remarques' => $demande->remarks,
            ]);

            // 4. Decode 'contenu' and create Details (DetFact)
            // Expected format in contenu: JSON string of items [{livre_id, quantite, prix_unitaire_ht, remise}]
            $items = json_decode($demande->contenu, true);
            $totalHt = 0;

            if (is_array($items)) {
                foreach ($items as $item) {
                    $qty = $item['quantite'] ?? 1;
                    $price = $item['prix_unitaire_ht'] ?? 0;
                    $remise = $item['remise'] ?? 0;

                    // total_ligne_ht: (Qty * Price) * (1 - Remise/100)
                    $lineTotal = ($qty * $price) * (1 - ($remise / 100));
                    $totalHt += $lineTotal;

                    DetFact::create([
                        'id' => (string) Str::uuid(),
                        'fact_id' => $fact->id,
                        'livre_id' => $item['livre_id'],
                        'quantite' => $qty,
                        'prix_unitaire_ht' => $price,
                        'remise' => $remise,
                        'total_ligne_ht' => $lineTotal,
                    ]);
                }
            }

            // 5. Update Fact totals
            $totalTtc = $totalHt * (1 + ($fact->tva_rate / 100));
            $fact->update([
                'total_ht' => $totalHt,
                'total_ttc' => $totalTtc,
                'reste_a_payer' => $totalTtc
            ]);

            // 6. Mark request as delivered
            $demande->update(['livree' => true, 'statut' => 1]); // 1 for validated

            return new FactResource($fact->load(['representant', 'details.livre']));
        });
    }
}