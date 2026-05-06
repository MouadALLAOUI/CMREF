<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Representant;
use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'representant_id' => Representant::pluck('id')->random(),
            'destination_id' => Destination::pluck('id')->random(),
            'raison_sociale' => $this->faker->company(),
            'ice' => $this->faker->unique()->numerify('###############'),
            'ville' => $this->faker->city(),
            'adresse' => $this->faker->address(),
            'tel' => substr($this->faker->unique()->phoneNumber(), 0, 20),
            'email' => $this->faker->safeEmail(),
        ];
    }
}
