<?php

namespace Database\Factories;

use App\Models\Depot;
use App\Models\Representant;
use App\Models\Livre;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepotFactory extends Factory
{
    protected $model = Depot::class;

    public function definition(): array
    {
        return [
            // Using a factory() here is safer than pluck() for standalone testing,
            // but the seeder logic above will override these anyway.
            'rep_id' => Representant::factory(),
            'livre_id' => Livre::factory(),
            'quantite_balance' => $this->faker->numberBetween(0, 1000),
            'status' => $this->faker->boolean(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
