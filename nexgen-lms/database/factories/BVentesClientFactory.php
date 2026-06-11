<?php

namespace Database\Factories;

use App\Models\BVentesClient;
use App\Models\Representant;
use App\Models\Client;
use App\Models\Livre;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class BVentesClientFactory extends Factory
{
    protected $model = BVentesClient::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'client_id' => Client::pluck('id')->random(),
            'season_id' => $s2627_id,
            'b_vente_number' => $this->faker->unique()->bothify('BV-####'),
            'date_vente' => $this->faker->date(),
            'type' => $this->faker->randomElement(['normal', 'retour']),
            'livre_id' => Livre::pluck('id')->random(),
            'quantite' => $this->faker->numberBetween(1, 50),
            'remise' => $this->faker->randomFloat(2, 0, 30),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
