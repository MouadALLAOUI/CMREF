<?php

namespace Database\Seeders;

use App\Models\CahierCommunication;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class CahierCommunicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();

        if ($rep) {
            CahierCommunication::create([
                'rep_id' => $rep->id,
                'date_communication' => '2026-02-07',
                'objet' => 'Instruction Livraison Secteur Sud',
                'message' => 'Veuillez prioriser les écoles de la zone Dades pour la semaine prochaine.',
                'priorite' => 'Haute',
                'est_lu' => false,
                'remarques' => 'Message automatique généré par le système de planning.',
            ]);
        }
    }
}
