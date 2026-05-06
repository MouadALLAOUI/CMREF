<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Representant;
use App\Models\Login;
use Illuminate\Database\Seeder;

class LoginSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Link the Admin profile
        $admin = Admin::where('login', 'admin')->first();
        if ($admin) {
            Login::create([
                'username' => $admin->login,
                'password' => $admin->password,
                'authenticatable_id' => $admin->id,
                'authenticatable_type' => Admin::class,
                'role' => 'admin',
                'last_visit' => now(),
            ]);
        }

        // 2. Link the Representant profile
        // $rep = Representant::where('login', 'rep_adnane')->first();
        // if ($rep) {
        //     Login::create([
        //         'username' => $rep->login,
        //         'password' => $rep->password,
        //         'authenticatable_id' => $rep->id,
        //         'authenticatable_type' => Representant::class,
        //         'role' => 'representant',
        //         'last_visit' => now(),
        //     ]);
        // }
    }
}
