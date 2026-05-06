<?php

namespace Database\Factories;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

class DestinationFactory extends Factory
{
    protected $model = Destination::class;

    public function definition(): array
    {
        return [
            'destination' => $this->faker->unique()->city(),
            'description' => $this->faker->sentence(),
        ];
    }
}
