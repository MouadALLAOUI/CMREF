<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('representant_id')->constrained('representants')->onDelete('cascade'); // Link to Representative
            $table->foreignUuid('destination_id')->nullable()->constrained('destinations')->onDelete('set null'); // Link to Zone (Destination)
            $table->string('raison_sociale', 255); // Renamed from 'ste'
            $table->string('ice', 20)->nullable(); // Identifiant Commun des Entreprises
            $table->string('ville', 100)->nullable();
            $table->text('adresse')->nullable();
            $table->string('tel', 20)->nullable();
            $table->string('email', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
