<?php

namespace Database\Factories;

use App\Models\RembImp;
use App\Models\Imprimeur;
use App\Models\Banque;
use Illuminate\Database\Eloquent\Factories\Factory;

class RembImpFactory extends Factory
{
    protected $model = RembImp::class;

    public function definition(): array
    {
        return [
            'imprimeur_id' => Imprimeur::pluck('id')->random(),
            'date_payment' => $this->faker->date(),
            'banque_id' => Banque::pluck('id')->random(),
            'banque_nom' => $this->faker->company() . ' Bank',
            'cheque_number' => $this->faker->numerify('##########'),
            'cheque_image_path' => null,
            'montant' => $this->faker->randomFloat(2, 500, 50000),
            'statut_recu' => $this->faker->boolean(),
            'statut_rejete' => $this->faker->boolean(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
