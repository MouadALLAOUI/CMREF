<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email');
            $table->string('role', 50)->default('représentant'); // représentant, fournisseur, admin
            $table->text('message')->nullable();
            $table->string('token', 64)->unique();
            $table->timestamp('expires_at')->index();
            $table->timestamp('accepted_at')->nullable();
            $table->string('statut', 50)->default('en attente'); // en attente, acceptée, expirée
            $table->nullableUuidMorphs('emetteur', 'emetteur');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
