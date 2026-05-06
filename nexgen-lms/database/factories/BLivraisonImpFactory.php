<?php

namespace Database\Factories;

use App\Models\BLivraisonImp;
use App\Models\Imprimeur;
use Illuminate\Database\Eloquent\Factories\Factory;

class BLivraisonImpFactory extends Factory
{
    use HasSchoolYear;
    protected $model = BLivraisonImp::class;

    public function definition(): array
    {
        return [
            'imprimeur_id' => Imprimeur::pluck('id')->random(),
            'date_reception' => $this->faker->date(),
            'b_livraison_number' => $this->faker->unique()->bothify('BLI-####'),
            'remarks' => $this->faker->sentence(),
            'annee' => $this->generateSchoolYear(5),
        ];
    }
}
