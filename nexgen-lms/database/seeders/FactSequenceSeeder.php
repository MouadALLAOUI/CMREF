<?php

namespace Database\Seeders;

use App\Models\FactSequence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FactSequenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FactSequence::create([
            'nom' => '2025-2026',
            'dernier_numero' => 0, // La prochaine facture sera la n°1
            'est_active' => false,
        ]);

        // Optionnel : Préparer la session suivante
        FactSequence::create([
            'nom' => '2026-2027',
            'dernier_numero' => 0,
            'est_active' => true, // Désactivée pour l'instant
        ]);
    }
}
