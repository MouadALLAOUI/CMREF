<?php

namespace Database\Factories;

use App\Models\Content;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContentFactory extends Factory
{
    protected $model = Content::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->word(),
            'champ1' => $this->faker->sentence(),
            'champ2' => $this->faker->sentence(),
            'champ3' => $this->faker->sentence(),
        ];
    }
}
