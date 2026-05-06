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
        Schema::create('catalogues', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->string('titre', 255); // Renamed from TEXT
            $table->foreignUuid('categorie_id')->constrained('categories')->onDelete('cascade'); // Link to category
            $table->text('image_url')->nullable(); // Renamed from 'image'
            $table->text('content')->nullable(); // For rich descriptions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalogues');
    }
};
