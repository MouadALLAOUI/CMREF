<?php

namespace Database\Seeders;

use App\Models\Banque;
use App\Models\RepRemboursement;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class RepRemboursementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        $banqueId = Banque::where('code_abreviation', 'BMCE')->first()?->id;

        if ($rep) {
            RepRemboursement::create([
                'rep_id' => $rep->id,
                'date_payment' => '2026-02-06',
                'banque_nom' => 'BMCE',
                'banque_id' => $banqueId,
                'cheque_number' => 'CH-990011',
                'cheque_image_path' => 'https://placehold.co/300x100@3x/white/red/png?font=poppins&text=Cheque+Image', // Dummy path for testing
                'type_versement' => 'Virement',
                'montant' => 5000.00,
                'statut_accepte' => true,
                'remarks' => 'Versement avec justificatif image',
            ]);
        }
    }
}
