<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            ['destination' => 'Marrakech', 'description' => ''],
            ['destination' => 'Settat', 'description' => ''],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}
