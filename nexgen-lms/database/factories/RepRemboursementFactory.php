<?php

namespace Database\Factories;

use App\Models\RepRemboursement;
use App\Models\Representant;
use App\Models\Banque;
use App\Models\Fact;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class RepRemboursementFactory extends Factory
{
    protected $model = RepRemboursement::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'fact_id' => Fact::pluck('id')->random(),
            'season_id' => $s2627_id,
            'date_payment' => $this->faker->date(),
            'banque_id' => Banque::pluck('id')->random(),
            // 'banque_nom' => $this->faker->company() . ' Bank',
            'cheque_number' => $this->faker->numerify('##########'),
            'type_versement' => $this->faker->randomElement(['En main propre', 'Virement', 'Versement']),
            'montant' => $this->faker->randomFloat(2, 100, 10000),
            'date_prevue' => $this->faker->date(),
            'date_versement' => $this->faker->date(),
            'statut_recu' => $this->faker->boolean(),
            'statut_rejete' => $this->faker->boolean(),
            'statut_accepte' => $this->faker->boolean(),
            'remarks' => $this->faker->sentence(),
        ];
    }
}
