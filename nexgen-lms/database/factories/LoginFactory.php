<?php

namespace Database\Factories;

use App\Models\Login;
use App\Models\Admin;
use App\Models\Representant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class LoginFactory extends Factory
{
    protected $model = Login::class;

    public function definition(): array
    {
        $profileType = $this->faker->randomElement([Admin::class, Representant::class]);
        $profile = $profileType::factory()->create();

        return [
            'username' => $this->faker->unique()->userName(),
            'password' => Hash::make('password'),
            'authenticatable_id' => $profile->id,
            'authenticatable_type' => $profileType,
            'role' => $profileType === Admin::class ? 'admin' : 'representant',
            'is_active' => $this->faker->boolean(),
            'is_online' => false,
            'last_visit' => $this->faker->dateTime(),
        ];
    }
}
