<?php

namespace Tests\Feature;

use App\Models\Login;
use App\Models\Representant;
use App\Models\Admin;
use App\Models\BLivraison;
use App\Models\Livre;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Season;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RepresentantAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed seasons so Season::pluck()->random() succeeds in factories
        $this->seed(\Database\Seeders\SeasonsSeeder::class);

        // Create a destination so Destination::pluck()->random() succeeds in RepresentantFactory
        Destination::factory()->create();

        // Create a category so Category::pluck()->random() succeeds in LivreFactory
        Category::factory()->create();
    }

    public function test_representative_can_only_access_their_own_deliveries()
    {
        // Create representatives first so Representant::pluck()->random() succeeds
        $rep1 = Representant::factory()->create();
        $rep2 = Representant::factory()->create();

        $login1 = Login::factory()->create([
            'role' => 'representant',
            'authenticatable_id' => $rep1->id,
            'authenticatable_type' => Representant::class,
            'is_active' => true,
        ]);

        $login2 = Login::factory()->create([
            'role' => 'representant',
            'authenticatable_id' => $rep2->id,
            'authenticatable_type' => Representant::class,
            'is_active' => true,
        ]);

        // Create deliveries
        $delivery1 = BLivraison::factory()->create([
            'rep_id' => $rep1->id,
        ]);

        $delivery2 = BLivraison::factory()->create([
            'rep_id' => $rep2->id,
        ]);

        // Act as rep1
        $response = $this->actingAs($login1, 'sanctum')->getJson('/api/b-livraisons');
        $response->assertStatus(200);
        
        // Assert only delivery1 is returned
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($delivery1->id, $data[0]['id']);

        // Assert rep1 cannot show delivery2 (should return 404 due to global scope)
        $responseShow = $this->actingAs($login1, 'sanctum')->getJson("/api/b-livraisons/{$delivery2->id}");
        $responseShow->assertStatus(404);
    }

    public function test_representative_cannot_modify_reference_data()
    {
        $rep = Representant::factory()->create();
        $login = Login::factory()->create([
            'role' => 'representant',
            'authenticatable_id' => $rep->id,
            'authenticatable_type' => Representant::class,
            'is_active' => true,
        ]);

        $category = Category::first();
        $livre = Livre::factory()->create([
            'categorie_id' => $category->id,
        ]);

        // Try to update book as representative (should be blocked by read_only_rep middleware)
        $response = $this->actingAs($login, 'sanctum')->putJson("/api/livres/{$livre->id}", [
            'titre' => 'Updated Title',
        ]);
        $response->assertStatus(403);
    }

    public function test_admin_can_access_all_deliveries_and_reference_data()
    {
        $admin = Admin::factory()->create();
        $login = Login::factory()->create([
            'role' => 'admin',
            'authenticatable_id' => $admin->id,
            'authenticatable_type' => Admin::class,
            'is_active' => true,
        ]);

        $rep = Representant::factory()->create();
        $delivery = BLivraison::factory()->create([
            'rep_id' => $rep->id,
        ]);

        $category = Category::first();
        $livre = Livre::factory()->create([
            'categorie_id' => $category->id,
        ]);

        // Admin can list all deliveries
        $response = $this->actingAs($login, 'sanctum')->getJson('/api/b-livraisons');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));

        // Admin can update book
        $responseUpdate = $this->actingAs($login, 'sanctum')->putJson("/api/livres/{$livre->id}", [
            'titre' => 'New Title',
            'code' => 'CODE123',
            'prix_achat' => 100,
            'prix_vente' => 150,
            'prix_public' => 160,
            'nb_pages' => 200,
            'annee_publication' => '2026',
            'categorie_id' => $category->id,
        ]);
        $responseUpdate->assertStatus(200);
    }
}
