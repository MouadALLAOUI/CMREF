<?php

namespace Database\Seeders;

use App\Models\BVentesClient;
use App\Models\Client;
use App\Models\Livre;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class BVentesClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        $client = Client::where('raison_sociale', 'Like', '%Manara%')->first();
        $livre = Livre::where('code', 'R1')->first();

        if ($rep && $client && $livre) {
            BVentesClient::create([
                'rep_id' => $rep->id,
                'client_id' => $client->id,
                'b_vente_number' => 'BVC-2026-0001',
                'date_vente' => '2026-02-06',
                'type' => 'Vente Directe',
                'livre_id' => $livre->id,
                'quantite' => 20,
                'remise' => 10.00,
                'remarks' => 'Vente annuelle pour le primaire',
            ]);
        }
    }
}
