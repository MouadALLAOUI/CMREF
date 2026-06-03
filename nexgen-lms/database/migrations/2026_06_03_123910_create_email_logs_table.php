<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('destinataire');
            $table->string('sujet', 255);
            $table->text('message');
            $table->string('type', 50)->default('email'); // email, invitation
            $table->string('statut', 50)->default('envoyé'); // envoyé, échoué, en attente
            $table->nullableUuidMorphs('emetteur', 'emetteur'); // admin who sent it
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
