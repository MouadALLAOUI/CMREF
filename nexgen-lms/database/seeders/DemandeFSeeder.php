<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\DemandeF;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class DemandeFSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::first();
        $client = Client::first();

        if ($rep && $client) {
            DemandeF::create([
                'rep_id' => $rep->id,
                'client_id' => $client->id,
                'date_demande' => now(),
                'objet' => 'Demande de facture - Commande Janvier',
                'contenu' => 'Articles pour la rentrée scolaire 2026',
                'statut' => 'En attente',
            ]);
        }
    }
}
