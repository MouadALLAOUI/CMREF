<?php

namespace Database\Factories;

use App\Models\CarteVisite;
use App\Models\Representant;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarteVisiteFactory extends Factory
{
    protected $model = CarteVisite::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'season_id' => $s2627_id,
            'model' => $this->faker->word(),
            'date_commande' => $this->faker->date(),
            'nom_sur_carte' => $this->faker->name(),
            'fonction' => $this->faker->jobTitle(),
            'tel' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'adresse' => $this->faker->address(),
            'autre_info' => $this->faker->sentence(),
            'logo_path' => null,
            'chevalet_ligne_1' => $this->faker->word(),
            'chevalet_ligne_2' => $this->faker->word(),
            'chevalet_ligne_3' => $this->faker->word(),
            'conception_carte' => $this->faker->boolean(),
            'is_valide_carte' => $this->faker->boolean(),
            'conception_chevalet' => $this->faker->boolean(),
            'is_valide_chevalet' => $this->faker->boolean(),
            'comment_cv' => $this->faker->sentence(),
            'comment_chevalet' => $this->faker->sentence(),
            'remarques' => $this->faker->sentence(),
            'prod_carte' => $this->faker->boolean(),
            'livraison_carte' => $this->faker->boolean(),
            'recu_carte' => $this->faker->boolean(),
            'prod_chevalet' => $this->faker->boolean(),
            'livraison_chevalet' => $this->faker->boolean(),
            'recu_chevalet' => $this->faker->boolean(),

            'is_deleted' => false,
        ];
    }
}
