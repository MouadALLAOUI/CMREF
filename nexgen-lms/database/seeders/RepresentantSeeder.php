<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Destination;
use App\Models\Representant;
use Illuminate\Database\Seeder;

class RepresentantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $zone = Destination::where('destination', 'Marrakech')->first();
        Representant::create([
            'nom' => 'Adnane',
            'cin' => 'AB123456',
            'destination_id' => $zone->id,
            'tel' => '0600000000',
            'email' => 'adnane@ajial-medias.com',
            'login' => 'rep_adnane',
            'password' => bcrypt('12345678'),
        ]);
    }
}
