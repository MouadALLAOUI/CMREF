<?php

namespace Database\Factories;

use App\Models\BLivraisonImp;
use App\Models\Imprimeur;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class BLivraisonImpFactory extends Factory
{
    protected $model = BLivraisonImp::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'imprimeur_id' => Imprimeur::pluck('id')->random(),
            'season_id' => $s2627_id,
            'date_reception' => $this->faker->date(),
            'b_livraison_number' => $this->faker->unique()->bothify('BLI-####'),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
