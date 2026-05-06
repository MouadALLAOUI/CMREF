<?php

namespace Database\Seeders;

use App\Models\Fact;
use App\Models\FactSequence;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class FactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        $sequence = FactSequence::where('est_active', true)->first();

        if ($rep && $sequence) {
            // 1. Incrémenter le compteur de la séquence (comme le fera votre application)
            $nextNumber = $sequence->dernier_numero + 1;

            Fact::create([
                'rep_id' => $rep->id,
                'sequence_id' => $sequence->id,

                // Champs obligatoires selon votre migration
                'year_session' => $sequence->nom, // ex: "2026-2027"
                'number' => $nextNumber,

                'fact_number' => "FACT/{$sequence->nom}/" . str_pad($nextNumber, 4, '0', STR_PAD_LEFT),
                'date_facture' => now(),
                'total_ht' => 1000.00,
                'tva_rate' => 20.00,
                'total_ttc' => 1200.00,
                'status' => 'Validée',
                'remarques' => 'Facture mensuelle initiale',
            ]);

            // 2. Mettre à jour la séquence pour que la prochaine facture soit la n°2
            $sequence->update(['dernier_numero' => $nextNumber]);
        }
    }
}
