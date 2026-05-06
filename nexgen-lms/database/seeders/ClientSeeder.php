<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        if ($rep) {
            Client::create([
                'representant_id' => $rep->id,
                'raison_sociale' => 'Ecole EXEMPLE',
                'ville' => 'marrakech',
                'adresse' => 'marrakech, Maroc',
                'tel' => '0524000000',
                'email' => 'contact@example.ma',
            ]);
        }
        //
    }
}
