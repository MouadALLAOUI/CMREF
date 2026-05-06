<?php

namespace Database\Factories;

use App\Models\DetFact;
use App\Models\Fact;
use App\Models\Livre;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetFactFactory extends Factory
{
    protected $model = DetFact::class;

    public function definition(): array
    {
        $qty = $this->faker->numberBetween(1, 100);
        $price = $this->faker->randomFloat(2, 10, 200);
        $remise = $this->faker->randomFloat(2, 0, 20);
        $total = ($qty * $price) * (1 - $remise / 100);

        return [
            'fact_id' => Fact::pluck('id')->random(),
            'livre_id' => Livre::pluck('id')->random(),
            'quantite' => $qty,
            'prix_unitaire_ht' => $price,
            'remise' => $remise,
            'total_ligne_ht' => $total,
        ];
    }
}
