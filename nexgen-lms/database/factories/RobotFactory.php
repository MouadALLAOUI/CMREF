<?php

namespace Database\Factories;

use App\Models\Robot;
use App\Models\Representant;
use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

class RobotFactory extends Factory
{
    protected $model = Robot::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
            'destination_id' => Destination::pluck('id')->random(),
            'date_operation' => $this->faker->date(),
            'ville' => $this->faker->city(),
            'etablissement' => $this->faker->company(),
            'contact_nom' => $this->faker->name(),
            'contact_tel' => $this->faker->phoneNumber(),
            'reference_robot' => $this->faker->unique()->bothify('ROBOT-####'),
            'quantite_vue' => $this->faker->numberBetween(1, 10),
            'quantite_recue' => $this->faker->numberBetween(0, 10),
            'images' => [],
            'statut' => $this->faker->randomElement(['Placé', 'En Démonstration', 'Retourné', 'Vendu']),
            'remarques' => $this->faker->sentence(),
        ];
    }
}
