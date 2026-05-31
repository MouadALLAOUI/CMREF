<?php

namespace Database\Seeders;

use App\Models\Season;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeasonsSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seasons = [
            [
                'name' => '2324',
                'start_date' => '2023-09-01',
                'start_year' => '2023',
                'end_date' => '2024-08-31',
                'end_year' => '2024',
                'is_active' => false
            ],
            [
                'name' => '2425',
                'start_date' => '2024-09-01',
                'start_year' => '2024',
                'end_date' => '2025-08-31',
                'end_year' => '2025',
                'is_active' => false
            ],
            [
                'name' => '2526',
                'start_date' => '2025-09-01',
                'start_year' => '2025',
                'end_date' => '2026-08-31',
                'end_year' => '2026',
                'is_active' => false
            ],
            [
                'name' => '2627',
                'start_date' => '2026-09-01',
                'start_year' => '2026',
                'end_date' => '2027-08-31',
                'end_year' => '2027',
                'is_active' => true
            ],
            [
                'name' => '2728',
                'start_date' => '2027-09-01',
                'start_year' => '2027',
                'end_date' => '2028-08-31',
                'end_year' => '2028',
                'is_active' => false
            ],
            [
                'name' => '2829',
                'start_date' => '2028-09-01',
                'start_year' => '2028',
                'end_date' => '2029-08-31',
                'end_year' => '2029',
                'is_active' => false
            ],
            [
                'name' => '2930',
                'start_date' => '2029-09-01',
                'start_year' => '2029',
                'end_date' => '2030-08-31',
                'end_year' => '2030',
                'is_active' => false
            ],
        ];

        foreach ($seasons as $season) {
            Season::create($season);
        }
    }
}
