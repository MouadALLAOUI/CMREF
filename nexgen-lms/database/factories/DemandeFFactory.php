<?php

namespace Database\Factories;

use App\Models\DemandeF;
use App\Models\Representant;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class DemandeFFactory extends Factory
{
    protected $model = DemandeF::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
            'client_id' => Client::pluck('id')->random(),
            'date_demande' => $this->faker->date(),
            'ref' => $this->faker->randomDigitNotNull(),
            'type' => $this->faker->randomElement(['MSM', 'Wataniya']),
            'statut' => $this->faker->boolean(),
            'contenu' => $this->faker->paragraph(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
