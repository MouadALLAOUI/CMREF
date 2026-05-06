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
        Schema::create('det_fact', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fact_id')->constrained('fact')->onDelete('cascade'); // Link to Invoice Header
            $table->foreignUuid('livre_id')->constrained('livres')->onDelete('restrict'); // Link to Book
            $table->integer('quantite')->default(1);
            $table->decimal('prix_unitaire_ht', 15, 2); // Price at time of invoicing
            $table->decimal('remise', 5, 2)->default(0.00); // Specific discount for this item
            $table->decimal('total_ligne_ht', 15, 2); // Calculated: (Qty * Price) - Remise
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('det_fact');
    }
};
