<?php

namespace Database\Factories;

use App\Models\Representant;
use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class RepresentantFactory extends Factory
{
    protected $model = Representant::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->name(),
            'cin' => $this->faker->unique()->bothify('??######'),
            'destination_id' => Destination::pluck('id')->random(),
            'tel' => substr($this->faker->unique()->phoneNumber(), 0, 20),
            'email' => $this->faker->unique()->safeEmail(),
            'adresse' => $this->faker->address(),
            'code_postale' => $this->faker->postcode(),
            'ville' => $this->faker->city(),
            'lieu_de_travail' => $this->faker->company(),
            'login' => $this->faker->unique()->userName(),
            'password' => Hash::make('password'),
            'bl_count' => 0,
            'remb_count' => 0,
        ];
    }
}
