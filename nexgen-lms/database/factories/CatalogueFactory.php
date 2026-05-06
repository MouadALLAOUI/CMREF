<?php

namespace Database\Factories;

use App\Models\Catalogue;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CatalogueFactory extends Factory
{
    protected $model = Catalogue::class;

    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(3),
            'categorie_id' => Category::pluck('id')->random(),
            'image_url' => $this->faker->imageUrl(),
            'content' => $this->faker->text(),
        ];
    }
}
