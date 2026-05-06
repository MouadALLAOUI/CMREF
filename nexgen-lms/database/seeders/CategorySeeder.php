<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['libelle' => 'Primaire', 'description' => 'Enseignement primaire'],
            ['libelle' => 'Collège', 'description' => 'Enseignement secondaire collégial'],
            ['libelle' => 'Lycée', 'description' => 'Enseignement secondaire qualifiant'],
            ['libelle' => 'Près-scolaire', 'description' => 'Enseignement préscolaire'],
            ['libelle' => 'Robotos', 'description' => 'Matériel de robotique et informatique'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
