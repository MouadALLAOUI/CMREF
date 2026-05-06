<?php

namespace Database\Factories;

use App\Models\DemandeF;
use App\Models\Fact;
use App\Models\Representant;
use App\Models\FactSequence;
use Illuminate\Database\Eloquent\Factories\Factory;

class FactFactory extends Factory
{
    protected $model = Fact::class;

    public function definition(): array
    {
        $totalHt = $this->faker->randomFloat(2, 100, 5000);
        $tvaRate = 20;
        $totalTtc = $totalHt * (1 + $tvaRate / 100);

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'sequence_id' => FactSequence::pluck('id')->random(),
            'demande_id' => DemandeF::pluck('id')->random(),
            'year_session' => $this->faker->year(),
            'number' => $this->faker->unique()->numberBetween(1, 9999),
            'fact_number' => $this->faker->unique()->bothify('FACT-####'),
            'date_facture' => $this->faker->date(),
            'total_ht' => $totalHt,
            'tva_rate' => $tvaRate,
            'total_ttc' => $totalTtc,
            'status' => $this->faker->randomElement(['Brouillon', 'Validée', 'Payée', 'Annulée']),
            'remarques' => $this->faker->sentence(),
        ];
    }
}
