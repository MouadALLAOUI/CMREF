<?php

namespace Database\Factories;

use App\Models\Imprimeur;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImprimeurFactory extends Factory
{
    protected $model = Imprimeur::class;

    public function definition(): array
    {
        return [
            'raison_sociale' => $this->faker->company(),
            'adresse' => $this->faker->address(),
            'directeur_nom' => $this->faker->name(),
            'directeur_tel' => $this->faker->phoneNumber(),
            'directeur_email' => $this->faker->companyEmail(),
            'adjoint_nom' => $this->faker->name(),
            'adjoint_tel' => $this->faker->phoneNumber(),
            'adjoint_email' => $this->faker->safeEmail(),
        ];
    }
}
