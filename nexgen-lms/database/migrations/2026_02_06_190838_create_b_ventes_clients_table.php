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
        Schema::create('b_ventes_clients', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->uuid('rep_id')->nullable()->index(); // Link to Rep
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->uuid('client_id')->nullable()->index(); // Link to Client
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
            $table->string('b_vente_number', 50); // Reference number
            $table->date('date_vente')->index(); // Professional DATE type
            $table->string('type', 50)->nullable(); // e.g., Facturé, Offert
            $table->foreignUuid('livre_id')->nullable()->constrained('livres')->nullOnDelete(); // Link to Book
            $table->integer('quantite')->default(0); // Sold quantity
            $table->decimal('remise', 5, 2)->default(0.00); // Changed from INT to DECIMAL for precision
            $table->text('remarks')->nullable(); // Legacy 'ann' field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_ventes_clients');
    }
};
