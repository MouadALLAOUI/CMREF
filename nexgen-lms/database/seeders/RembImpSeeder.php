<?php

namespace Database\Seeders;

use App\Models\Banque;
use App\Models\Imprimeur;
use App\Models\RembImp;
use Illuminate\Database\Seeder;

class RembImpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imp = Imprimeur::where('raison_sociale', 'watanya')->first();
        $banqueId = Banque::where('code_abreviation', 'CIH')->first()?->id;

        if ($imp) {
            RembImp::create([
                'imprimeur_id' => $imp->id,
                'date_payment' => '2026-02-07',
                'banque_nom' => 'CIH Bank',
                'banque_id' => $banqueId,
                'cheque_number' => 'CH-554433',
                'cheque_image_path' => 'https://placehold.co/300x100@3x/white/red/png?font=poppins&text=Cheque+Image+IMP', //
                'montant' => 15000.00,
                'statut_recu' => true,
                'remarks' => 'Règlement facture impression Janvier 2026',
            ]);
        }
    }
}
