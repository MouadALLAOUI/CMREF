<?php

namespace Database\Seeders;

use App\Models\BLivraisonImp;
use App\Models\Imprimeur;
use App\Models\Livre;
use Illuminate\Database\Seeder;

class BLivraisonImpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imp = Imprimeur::where('raison_sociale', 'watanya')->first();
        $livre = Livre::where('code', 'R1')->first();

        if ($imp && $livre) {
            BLivraisonImp::create([
                'imprimeur_id' => $imp->id,
                'date_reception' => '2026-02-01',
                'b_livraison_number' => 'W-BL-9988',
                'livre_id' => $livre->id,
                'quantite' => 1000,
                'remarks' => 'Réception de la première édition 2026',
            ]);
        }
    }
}
