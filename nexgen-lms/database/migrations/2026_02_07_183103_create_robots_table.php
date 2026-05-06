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
        Schema::create('robots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');
            $table->foreignUuid('destination_id')->nullable()->constrained('destinations')->onDelete('set null');

            // Tracking & Logistics
            $table->date('date_operation'); // Date of the action (placement/demo)
            $table->string('ville', 100);
            $table->text('etablissement'); // Name of the school or center

            // Point of Contact
            $table->string('contact_nom', 150);
            $table->string('contact_tel', 50);

            // Item Details
            $table->string('reference_robot', 100); // e.g., MBOT-V2, LEGO-SPIKE
            $table->integer('quantite_vue')->default(0); // Items presented/demoed
            $table->integer('quantite_recue')->default(0); // Items actually left/received

            // New: Column for multiple images (JSON array of paths)
            $table->json('images')->nullable();

            // Status & Notes
            $table->enum('statut', ['Placé', 'En Démonstration', 'Retourné', 'Vendu'])->default('Placé');
            $table->text('remarques')->nullable(); // Professional French for 'ann'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('robots');
    }
};