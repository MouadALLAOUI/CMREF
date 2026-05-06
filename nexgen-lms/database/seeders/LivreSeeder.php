<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Livre;
use Illuminate\Database\Seeder;

class LivreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $primaire = Category::where('libelle', 'Primaire')->first();
        $college = Category::where('libelle', 'Collège')->first();
        $robotos = Category::where('libelle', 'Robotos')->first();
        $livres = [
            // primaire
            [
                'titre' => 'Informatique et Robotique au primaire N 1',
                'code' => 'R1',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 40,
                'color_code' => "#00DDFF",
            ],
            [
                'titre' => 'Informatique et Robotique au primaire N 2',
                'code' => 'R2',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 40,
                'color_code' => "#00DDFF",
            ],
            [
                'titre' => 'Informatique et Robotique au primaire N 3',
                'code' => 'R3',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 48,
                'color_code' => "#00DDFF",
            ],
            [
                'titre' => 'Informatique et Robotique au primaire N 4',
                'code' => 'R4',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 56,
                'color_code' => "#00DDFF",
            ],
            [
                'titre' => 'Informatique et Robotique au primaire N 5',
                'code' => 'R5',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 56,
                'color_code' => "#00DDFF",
            ],
            [
                'titre' => 'Informatique et Robotique au primaire N 6',
                'code' => 'R6',
                'categorie_id' => $primaire->id,
                'prix_achat' => 10,
                'prix_vente' => 15,
                'prix_public' => 20,
                'nb_pages' => 56,
            ],

            // college
            [
                'titre' => 'Informatique, Robotique et Intelligence Artificielle au collège N1',
                'code' => 'IA7',
                'categorie_id' => $college->id,
                'prix_achat' => 20,
                'prix_vente' => 35,
                'prix_public' => 40,
                'nb_pages' => 96,
            ],
            [
                'titre' => 'Informatique, Robotique et Intelligence Artificielle au collège N2',
                'code' => 'IA8',
                'categorie_id' => $college->id,
                'prix_achat' => 20,
                'prix_vente' => 35,
                'prix_public' => 40,
                'nb_pages' => 80,
            ],

            // robotos
            [
                'titre' => 'mBot',
                'code' => 'mBot',
                'categorie_id' => $robotos->id,
                'prix_achat' => 300.00,
                'prix_vente' => 400.00,
                'prix_public' => 500.00,
                'nb_pages' => 0,
            ],
            [
                'titre' => 'Thymio',
                'code' => 'Thy',
                'categorie_id' => $robotos->id,
                'prix_achat' => 100.00,
                'prix_vente' => 200.00,
                'prix_public' => 300.00,
                'nb_pages' => 0,
            ],
        ];
        foreach ($livres as $livre) {
            Livre::create($livre);
        }
    }
}
