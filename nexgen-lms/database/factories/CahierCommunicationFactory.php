<?php

namespace Database\Factories;

use App\Models\CahierCommunication;
use App\Models\Representant;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

class CahierCommunicationFactory extends Factory
{
    protected $model = CahierCommunication::class;

    public function definition(): array
    {
        $s2627_id = Season::where('name', '2627')->value('id');

        return [
            'rep_id' => Representant::pluck('id')->random(),
            'season_id' => $s2627_id,
            'ecole' => $this->faker->company(),
            'type' => $this->faker->word(),
            'qte' => $this->faker->numberBetween(10, 500),
            'nom_fichier' => $this->faker->word() . '.pdf',
            'date_commande' => $this->faker->date(),
            'bon_de_commande' => $this->faker->word(),
            'indication' => $this->faker->sentence(),
            'model_recto' => $this->faker->word(),
            'model_verso' => $this->faker->word(),
            'is_accepted' => $this->faker->boolean(),
            'is_refused' => $this->faker->boolean(),
            'etat_model' => $this->faker->numberBetween(0, 3),
            'date_validate_model' => $this->faker->dateTime(),
            'is_bc_validated' => $this->faker->boolean(),
            'is_printed' => $this->faker->boolean(),
            'is_delivered' => $this->faker->boolean(),
            'is_deleted' => false,
            'remarques' => $this->faker->sentence(),

        ];
    }
}
