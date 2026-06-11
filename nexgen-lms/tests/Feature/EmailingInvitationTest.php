<?php

namespace Tests\Feature;

use App\Models\Login;
use App\Models\Representant;
use App\Models\Admin;
use App\Models\Destination;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmailingInvitationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\SeasonsSeeder::class);
        Destination::factory()->create();
    }

    public function test_admin_can_send_emails_and_invitations()
    {
        $admin = Admin::factory()->create();
        $login = Login::factory()->create([
            'role' => 'admin',
            'authenticatable_id' => $admin->id,
            'authenticatable_type' => Admin::class,
            'is_active' => true,
        ]);

        // Send simulated email
        $responseEmail = $this->actingAs($login, 'sanctum')->postJson('/api/emails/send', [
            'to' => 'test@example.com',
            'subject' => 'Hello',
            'message' => 'World',
        ]);
        $responseEmail->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Email en cours d\'envoi.',
            ]);

        // Send simulated invitation
        $responseInvite = $this->actingAs($login, 'sanctum')->postJson('/api/invitations', [
            'email' => 'invite@example.com',
            'role' => 'représentant',
            'message' => 'Welcome',
        ]);
        $responseInvite->assertStatus(201)
            ->assertJsonPath('email', 'invite@example.com');
    }

    public function test_representative_cannot_send_emails_or_invitations()
    {
        $rep = Representant::factory()->create();
        $login = Login::factory()->create([
            'role' => 'representant',
            'authenticatable_id' => $rep->id,
            'authenticatable_type' => Representant::class,
            'is_active' => true,
        ]);

        // Try to send email
        $responseEmail = $this->actingAs($login, 'sanctum')->postJson('/api/emails/send', [
            'to' => 'test@example.com',
            'subject' => 'Hello',
            'message' => 'World',
        ]);
        $responseEmail->assertStatus(403);

        // Try to send invitation
        $responseInvite = $this->actingAs($login, 'sanctum')->postJson('/api/invitations', [
            'email' => 'invite@example.com',
            'role' => 'représentant',
            'message' => 'Welcome',
        ]);
        $responseInvite->assertStatus(403);
    }

    public function test_validation_errors()
    {
        $admin = Admin::factory()->create();
        $login = Login::factory()->create([
            'role' => 'admin',
            'authenticatable_id' => $admin->id,
            'authenticatable_type' => Admin::class,
            'is_active' => true,
        ]);

        // Missing fields in email
        $responseEmail = $this->actingAs($login, 'sanctum')->postJson('/api/emails/send', []);
        $responseEmail->assertStatus(422)
            ->assertJsonValidationErrors(['to', 'subject', 'message']);

        // Invalid role in invitation
        $responseInvite = $this->actingAs($login, 'sanctum')->postJson('/api/invitations', [
            'email' => 'invite@example.com',
            'role' => 'invalid-role',
        ]);
        $responseInvite->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }
}
