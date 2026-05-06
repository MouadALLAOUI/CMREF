<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BanqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banques = [
            ['nom' => 'Attijariwafa Bank', 'code_abreviation' => 'AWB'],
            ['nom' => 'Banque Populaire', 'code_abreviation' => 'BCP'],
            ['nom' => 'BMCE Bank of Africa', 'code_abreviation' => 'BMCE'],
            ['nom' => 'Société Générale Maroc', 'code_abreviation' => 'SGMB'],
            ['nom' => 'BMCI', 'code_abreviation' => 'BMCI'],
            ['nom' => 'Crédit Agricole du Maroc', 'code_abreviation' => 'CAM'],
            ['nom' => 'Crédit du Maroc', 'code_abreviation' => 'CDM'],
            ['nom' => 'CIH Bank', 'code_abreviation' => 'CIH'],
            ['nom' => 'Al Barid Bank (Post)', 'code_abreviation' => 'ABB'],
            ['nom' => 'Poste-Bank', 'code_abreviation' => 'PB'],
        ];

        foreach ($banques as $banque) {
            \App\Models\Banque::create($banque);
        }
    }
}
