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
        Schema::create('b_livraison_items', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->uuidMorphs('deliverable'); // Link to the delivery note
            $table->foreignUuid('livre_id')->constrained('livres')->onDelete('restrict'); // Link to the book
            $table->integer('quantite')->default(0); // Number of books delivered
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_livraison_items');
    }
};
