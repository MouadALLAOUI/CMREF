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
        Schema::create('livres', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->string('titre', 255); // Renamed from TEXT
            $table->string('code', 50)->unique(); // Standardized SKU code
            $table->foreignUuid('categorie_id')->constrained('categories')->onDelete('restrict'); // Formal relation to Categories
            $table->decimal('prix_achat', 10, 2)->default(0.00); // Changed from FLOAT for precision
            $table->decimal('prix_vente', 10, 2)->default(0.00);
            $table->decimal('prix_public', 10, 2)->default(0.00);
            $table->unsignedInteger('nb_pages')->default(0); // Standardized INT
            $table->string('color_code', 7)->default('#FFFFFF'); // Hex code for UI
            $table->text('description')->nullable(); // Renamed from 'descr'
            $table->string('annee_publication', 4)->nullable(); // Standardized year format
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livres');
    }
};
