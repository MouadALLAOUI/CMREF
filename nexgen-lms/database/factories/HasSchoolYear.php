<?php

namespace Database\Factories;

trait HasSchoolYear
{
    /**
     * Generate a school year string (e.g., 2627)
     */
    public function generateSchoolYear($min = 0, $max = 0): string
    {
        // Using $this->faker because Laravel factories automatically provide it
        $startYear = (int)$this->faker->dateTimeBetween('-' . $min . ' years', '+' . $max . ' years')->format('y');
        $endYear = ($startYear + 1) % 100;

        return sprintf('%02d%02d', $startYear, $endYear);
    }
}
