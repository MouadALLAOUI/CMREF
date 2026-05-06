<?php

namespace Database\Seeders;

use App\Models\DetFact;
use App\Models\Fact;
use App\Models\Livre;
use Illuminate\Database\Seeder;

class DetFactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fact = Fact::where('fact_number', 'FACT-2026-0001')->first();
        $livre = Livre::where('code', 'R1')->first();

        if ($fact && $livre) {
            DetFact::create([
                'fact_id' => $fact->id,
                'livre_id' => $livre->id,
                'quantite' => 10,
                'prix_unitaire_ht' => 100.00,
                'remise' => 0.00,
                'total_ligne_ht' => 1000.00,
            ]);
        }
    }
}
