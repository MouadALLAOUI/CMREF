<?php

namespace Database\Factories;

use App\Models\RepRemboursement;
use App\Models\Representant;
use App\Models\Banque;
use App\Models\Fact;
use Illuminate\Database\Eloquent\Factories\Factory;

class RepRemboursementFactory extends Factory
{
    use HasSchoolYear;
    protected $model = RepRemboursement::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
            'fact_id' => Fact::pluck('id')->random(),
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
            'annee' => $this->generateSchoolYear(5),
            'remarks' => $this->faker->sentence(),
        ];
    }
}