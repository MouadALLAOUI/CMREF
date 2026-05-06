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
        Schema::create('b_livraisons', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade'); // Link to Rep
            $table->string('bl_number', 50); // Professional numbering (e.g., BL-2026-001)
            $table->date('date_emission');
            $table->text('mode_envoi')->nullable();
            $table->enum('type', ['Livre', 'Specimen', 'Pedagogie', 'Retour'])->default('Livre'); // Restricted types
            $table->boolean('statut_recu')->default(false);
            $table->boolean('statut_vu')->default(false);
            $table->enum('status', ['Pending', 'Seen', 'Received'])->default('Pending')->nullable(); // Status tracking
            $table->text('annee')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_livraisons');
    }
};
