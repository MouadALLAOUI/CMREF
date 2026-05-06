<?php

namespace Database\Factories;

use App\Models\ClientRemboursement;
use App\Models\Representant;
use App\Models\Client;
use App\Models\Banque;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientRemboursementFactory extends Factory
{
    protected $model = ClientRemboursement::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
            'client_id' => Client::pluck('id')->random(),
            'date_payment' => $this->faker->date(),
            'banque_id' => Banque::pluck('id')->random(),
            'banque_nom' => $this->faker->company() . ' Bank',
            'cheque_number' => $this->faker->numerify('##########'),
            'cheque_image_path' => null,
            'a_lordre_de' => $this->faker->name(),
            'montant' => $this->faker->randomFloat(2, 100, 10000),
            'observation' => $this->faker->sentence(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
