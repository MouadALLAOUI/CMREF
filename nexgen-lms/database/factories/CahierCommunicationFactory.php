<?php

namespace Database\Factories;

use App\Models\CahierCommunication;
use App\Models\Representant;
use Illuminate\Database\Eloquent\Factories\Factory;

class CahierCommunicationFactory extends Factory
{
    use HasSchoolYear;
    protected $model = CahierCommunication::class;

    public function definition(): array
    {
        return [
            'rep_id' => Representant::pluck('id')->random(),
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
            'annee_scolaire' => $this->generateSchoolYear(5),
        ];
    }
}
