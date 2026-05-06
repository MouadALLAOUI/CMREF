<?php

namespace Database\Seeders;

use App\Models\BLivraison;
use App\Models\BLivraisonItem;
use App\Models\Livre;
use Illuminate\Database\Seeder;

class BLivraisonItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bl = BLivraison::where('bl_number', 'BL-2026-0001')->first(); // Assuming you have at least one BLivraison record
        $livre = Livre::where('code', 'R1')->first();
        if ($bl && $livre) {
            BLivraisonItem::create([
                'bl_id' => $bl->id,
                'livre_id' => $livre->id,
                'quantite' => 10
            ]);
        }
    }
}
