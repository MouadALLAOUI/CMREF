<?php

namespace Database\Seeders;

use App\Models\Depot;
use App\Models\Livre;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class DepotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch our seeded Rep and Book
        $rep = Representant::where('nom', 'Adnane')->first();
        $livre = Livre::where('code', 'R1')->first();

        if ($rep && $livre) {
            Depot::create([
                'rep_id' => $rep->id,
                'livre_id' => $livre->id,
                'quantite_balance' => 50, // Matches the BL we created
                'remarks' => 'Stock initial suite à livraison BL-2026-0001',
            ]);
        }
    }
}
