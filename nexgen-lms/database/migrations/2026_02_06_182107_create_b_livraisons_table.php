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
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->uuid('rep_id')->nullable()->index(); // Link to Rep
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->string('bl_number', 50)->unique(); // Professional numbering (e.g., BL-2026-001)
            $table->date('date_emission')->index();
            $table->text('mode_envoi')->nullable();
            $table->enum('type', ['Livre', 'Specimen', 'Pedagogie', 'Retour'])->default('Livre'); // Restricted types
            $table->boolean('statut_recu')->default(false);
            $table->boolean('statut_vu')->default(false);
            $table->enum('status', ['Pending', 'Seen', 'Received'])->default('Pending')->nullable(); // Status tracking
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
