<?php

namespace Database\Seeders;

use App\Models\Banque;
use App\Models\Client;
use App\Models\ClientRemboursement;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class ClientRemboursementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();
        $client = Client::where('raison_sociale', 'Like', '%Manara%')->first();
        $banqueId = Banque::where('code_abreviation', 'AWB')->first()?->id;

        if ($rep && $client) {
            ClientRemboursement::create([
                'rep_id' => $rep->id,
                'client_id' => $client->id,
                'date_payment' => '2026-02-07',
                'banque_nom' => 'Attijariwafa Bank',
                'banque_id' => $banqueId,
                'cheque_number' => 'CH-887722',
                'cheque_image_path' => 'https://placehold.co/300x100@3x/white/red/png?font=poppins&text=Cheque+Image+Client', //
                'a_lordre_de' => 'Le Génie Edition',
                'montant' => 3000.00,
                'observation' => 'Paiement partiel commande R1',
            ]);
        }
    }
}
