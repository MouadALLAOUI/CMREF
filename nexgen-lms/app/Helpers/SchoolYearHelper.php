<?php

if (!function_exists('generateSchoolYear')) {
    /**
     * Generate a school year string (e.g., 2627)
     *
     * @param int $min Years in the past
     * @param int $max Years in the future
     * @return string
     */
    function generateSchoolYear(int $min = 0, int $max = 0): string
    {
        $faker = fake();
        $startYear = (int)$faker->dateTimeBetween('-' . $min . ' years', '+' . $max . ' years')->format('y');
        $endYear = ($startYear + 1) % 100;

        return sprintf('%02d%02d', $startYear, $endYear);
    }
}
