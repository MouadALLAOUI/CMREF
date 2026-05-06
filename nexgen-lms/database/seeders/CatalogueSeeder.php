<?php

namespace Database\Seeders;

use App\Models\Catalogue;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CatalogueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $robotos = Category::where('libelle', 'Robotos')->first();
        if ($robotos) {
            Catalogue::create([
                'titre' => 'Catalogue Robotos',
                'categorie_id' => $robotos->id,
                'image_url' => 'https://placehold.co/200x400@3x/green/yellow/png?font=poppins&text=catalogue+robotos',
                'content' => 'Découvrez notre catalogue de livres sur les robots, couvrant les dernières avancées en robotique, l\'intelligence artificielle et les applications pratiques.'
            ]);
        }
    }
}
