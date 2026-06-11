<?php

namespace Database\Factories;

use App\Models\Depot;
use App\Models\Representant;
use App\Models\Livre;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepotFactory extends Factory
{
    protected $model = Depot::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            // Using a factory() here is safer than pluck() for standalone testing,
            // but the seeder logic above will override these anyway.
            'rep_id' => Representant::factory(),
            'season_id' => $s2627_id,
            'livre_id' => Livre::factory(),
            'quantite_balance' => $this->faker->numberBetween(0, 1000),
            'status' => $this->faker->boolean(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
