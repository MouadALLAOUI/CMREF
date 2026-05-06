<?php

namespace Database\Factories;

use App\Models\Livre;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class LivreFactory extends Factory
{
    protected $model = Livre::class;

    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(3),
            'code' => $this->faker->unique()->ean8(),
            'categorie_id' => Category::pluck('id')->random(),
            'prix_achat' => $this->faker->randomFloat(2, 10, 100),
            'prix_vente' => $this->faker->randomFloat(2, 50, 200),
            'prix_public' => $this->faker->randomFloat(2, 60, 250),
            'nb_pages' => $this->faker->numberBetween(50, 500),
            'color_code' => $this->faker->hexColor(),
            'description' => $this->faker->paragraph(),
            'annee_publication' => $this->faker->year(),
        ];
    }
}
