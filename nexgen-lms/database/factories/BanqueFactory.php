<?php

namespace Database\Factories;

use App\Models\Banque;
use Illuminate\Database\Eloquent\Factories\Factory;

class BanqueFactory extends Factory
{
    protected $model = Banque::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->company() . ' Bank',
            'code_abreviation' => $this->faker->lexify('???'),
            'logo_path' => null,
            'is_active' => true,
        ];
    }
}
