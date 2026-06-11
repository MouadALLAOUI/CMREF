<?php

namespace Database\Factories;

use App\Models\BLivraison;
use App\Models\Representant;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class BLivraisonFactory extends Factory
{
    protected $model = BLivraison::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'season_id' => $s2627_id,
            'bl_number' => $this->faker->unique()->bothify('BL-####'),
            'date_emission' => $this->faker->date(),
            'type' => $this->faker->randomElement(['Livre', 'Specimen', 'Pedagogie', 'Retour']),
            'mode_envoi' => $this->faker->randomElement(['postal', 'courier', 'pickup']),
            'statut_recu' => $this->faker->boolean(),
            'statut_vu' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['Pending', 'Seen', 'Received']),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
