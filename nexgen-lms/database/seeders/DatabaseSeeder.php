<?php

namespace Database\Seeders;

use App\Models\BLivraison;
use App\Models\BLivraisonImp;
use App\Models\BLivraisonItem;
use App\Models\BVentesClient;
use App\Models\Banque;
use App\Models\CahierCommunication;
use App\Models\CarteVisite;
use App\Models\Catalogue;
use App\Models\Client;
use App\Models\ClientRemboursement;
use App\Models\Content;
use App\Models\DemandeF;
use App\Models\Depot;
use App\Models\Destination;
use App\Models\DetFact;
use App\Models\Fact;
use App\Models\FactSequence;
use App\Models\Imprimeur;
use App\Models\Livre;
use App\Models\Login;
use App\Models\RembImp;
use App\Models\RepRemboursement;
use App\Models\Representant;
use App\Models\Robot;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Foundation Seeders (Call these first)
        $this->call([
            AdminSeeder::class,
            DestinationSeeder::class,
            CategorySeeder::class,
            ImprimeurSeeder::class,
            BanqueSeeder::class,
            LoginSeeder::class,
        ]);

        // 2. Parent Factories
        Destination::factory(5)->create();
        $livres = Livre::factory(20)->create(); // Create books first to assign to depots later
        Imprimeur::factory(20)->create();
        Banque::factory(20)->create();
        FactSequence::factory(20)->create();
        User::factory(20)->create();
        Content::factory(20)->create();

        // 3. Create Representants AND their Login/Depots immediately
        // This ensures NO representant is left behind
        Representant::factory(15)->create()->each(function ($rep) use ($livres) {
            // Create the polymorphic Login
            Login::factory()->create([
                'username' => $rep->login,
                'password' => $rep->password,
                'authenticatable_id' => $rep->id,
                'authenticatable_type' => Representant::class,
                'role' => 'representant'
            ]);

            // Create random inventory for this representative
            $randomLivres = $livres->random(min(5, $livres->count()));
            foreach ($randomLivres as $livre) {
                Depot::factory()->create([
                    'rep_id' => $rep->id,
                    'livre_id' => $livre->id,
                ]);
            }
        });

        // 4. Secondary Entities (Clients depend on Reps)
        Client::factory(20)->create();
        Catalogue::factory(20)->create();
        Robot::factory(20)->create();

        // 5. Items & Transactions
        // Create the delivery notes
        $bls = BLivraison::factory(10)->create();
        $blis = BLivraisonImp::factory(14)->create();

        // Seed random number of items for standard BLs
        foreach ($bls as $bl) {
            // Generates between 1 and 8 items per BL
            $randomCount = fake()->numberBetween(1, 8);

            BLivraisonItem::factory($randomCount)->create([
                'deliverable_id' => $bl->id,
                'deliverable_type' => BLivraison::class // Better than hardcoded strings
            ]);
        }

        // Seed random number of items for Imprimeur BLs
        foreach ($blis as $bli) {
            // Generates between 2 and 10 items per BLI
            $randomCount = fake()->numberBetween(2, 10);

            BLivraisonItem::factory($randomCount)->create([
                'deliverable_id' => $bli->id,
                'deliverable_type' => BLivraisonImp::class
            ]);
        }

        // 6. Final Transactions
        BVentesClient::factory(20)->create();
        ClientRemboursement::factory(20)->create();
        RembImp::factory(20)->create();
        DemandeF::factory(20)->create();
        Fact::factory(20)->create();
        RepRemboursement::factory(20)->create();
        DetFact::factory(20)->create();
        CarteVisite::factory(20)->create();
        CahierCommunication::factory(20)->create();
    }

    private function faker()
    {
        return \Faker\Factory::create();
    }
}