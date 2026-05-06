<?php

namespace Database\Factories;

use App\Models\BLivraisonItem;
use App\Models\Livre;
use App\Models\BLivraison;
use App\Models\BLivraisonImp;
use Illuminate\Database\Eloquent\Factories\Factory;

class BLivraisonItemFactory extends Factory
{
    protected $model = BLivraisonItem::class;

    public function definition(): array
    {
        $deliverableType = $this->faker->randomElement([BLivraison::class, BLivraisonImp::class]);
        return [
            'deliverable_id' => $deliverableType::pluck('id')->random(),
            'deliverable_type' => $deliverableType,
            'livre_id' => Livre::pluck('id')->random(),
            'quantite' => $this->faker->numberBetween(1, 100),
        ];
    }
}
