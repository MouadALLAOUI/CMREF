<?php

namespace Database\Seeders;

use App\Models\Imprimeur;
use Illuminate\Database\Seeder;

class ImprimeurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imprimeurs = [
            [
                'raison_sociale' => 'watanya',
                'adresse' => 'Casablanca, Morocco',
                'directeur_nom' => 'Directeur Watanya',
            ],
            [
                'raison_sociale' => 'BEST BM',
                'adresse' => 'Rabat, Morocco',
                'directeur_nom' => 'Directeur BEST BM',
            ],
        ];

        foreach ($imprimeurs as $imp) {
            Imprimeur::create($imp);
        }
    }
}
