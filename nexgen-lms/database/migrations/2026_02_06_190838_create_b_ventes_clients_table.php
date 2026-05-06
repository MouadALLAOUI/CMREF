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
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade'); // Link to Rep
            $table->foreignUuid('client_id')->constrained('clients')->onDelete('cascade'); // Link to Client
            $table->string('b_vente_number', 50); // Reference number
            $table->date('date_vente'); // Professional DATE type
            $table->string('type', 50)->nullable(); // e.g., Facturé, Offert
            $table->foreignUuid('livre_id')->constrained('livres')->onDelete('restrict'); // Link to Book
            $table->integer('quantite')->default(0); // Sold quantity
            $table->decimal('remise', 5, 2)->default(0.00); // Changed from INT to DECIMAL for precision
            $table->string('annee', 50)->nullable();
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
