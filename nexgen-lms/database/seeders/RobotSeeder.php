<?php

namespace Database\Seeders;

use App\Models\Representant;
use App\Models\Robot;
use Illuminate\Database\Seeder;

class RobotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rep = Representant::where('nom', 'Adnane')->first();

        if ($rep) {
            Robot::create([
                'rep_id' => $rep->id,
                'date_operation' => '2026-02-07',
                'ville' => 'Kelaat M\'Gouna',
                'etablissement' => 'École El Mouahidine',
                'contact_nom' => 'Directeur Ahmed',
                'contact_tel' => '0600112233',
                'reference_robot' => 'KIT-ROBOT-EDUC-01',
                'quantite_vue' => 5,
                'quantite_recue' => 2,
                // Example of multiple image paths stored in JSON
                'images' => [
                    'robots/placement_01.jpg',
                    'robots/demo_unit_02.png'
                ],
                'statut' => 'En Démonstration',
                'remarques' => 'Photos prises lors du dépôt du matériel.',
            ]);
        }
    }
}
