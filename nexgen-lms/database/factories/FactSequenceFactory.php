<?php

namespace Database\Factories;

use App\Models\FactSequence;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactSequenceFactory extends Factory
{
    protected $model = FactSequence::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->numerify('####-####'),
            'dernier_numero' => 0,
            'est_active' => true,
        ];
    }
}
