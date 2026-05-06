<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\BLivraison;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class BLivraisonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        if ($rep) {
            BLivraison::create([
                'rep_id' => $rep->id,
                'bl_number' => 'BL-2026-001',
                'date_emission' => now(),
                'type' => 'Livre',
                'mode_envoi' => '---',
                'statut_recu' => true,
                'statut_vu' => true,
                'status' => 'Received',
                'remarks' => 'First delivery note for testing.'
            ]);
            BLivraison::create([
                'rep_id' => $rep->id,
                'bl_number' => 'BL-2026-002',
                'date_emission' => now(),
                'type' => 'Specimen',
                'mode_envoi' => '---',
                'statut_recu' => false,
                'statut_vu' => false,
                'status' => 'Pending',
                'remarks' => 'First delivery note for testing.'
            ]);
        }
    }
}
