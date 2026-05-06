<?php

namespace Database\Factories;

use App\Models\BLivraison;
use App\Models\Representant;
use Illuminate\Database\Eloquent\Factories\Factory;

class BLivraisonFactory extends Factory
{
    use HasSchoolYear;
    protected $model = BLivraison::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
            'bl_number' => $this->faker->unique()->bothify('BL-####'),
            'date_emission' => $this->faker->date(),
            'type' => $this->faker->randomElement(['Livre', 'Specimen', 'Pedagogie', 'Retour']),
            'mode_envoi' => $this->faker->randomElement(['postal', 'courier', 'pickup']),
            'statut_recu' => $this->faker->boolean(),
            'statut_vu' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['Pending', 'Seen', 'Received']),
            'annee' => $this->generateSchoolYear(5),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
