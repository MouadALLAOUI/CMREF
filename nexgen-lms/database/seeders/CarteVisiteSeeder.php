<?php

namespace Database\Seeders;

use App\Models\CarteVisite;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class CarteVisiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();

        if ($rep) {
            CarteVisite::create([
                'rep_id' => $rep->id,
                'date_distribution' => '2026-02-07',
                'type_support' => 'Carte de Visite Pro',
                'quantite' => 200,
                'destination' => 'Secteur Marrakech-Safi',
                'remarques' => 'Lot de cartes avec nouveau logo',
            ]);
        }
    }
}
