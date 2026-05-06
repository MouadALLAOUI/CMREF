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
        Schema::create('depots', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade'); // Link to Rep
            $table->foreignUuid('livre_id')->constrained('livres')->onDelete('cascade'); // Link to Book
            $table->text('type')->nullable(); // Legacy 'ann' field
            $table->integer('quantite_balance')->default(0); // Tracks current stock held
            $table->integer('status')->default(1); // Status of the account line
            $table->string('annee_scolaire')->nullable()->default(generateSchoolYear(2));
            $table->text('remarks')->nullable(); // Legacy 'ann' field
            $table->timestamps();

            // IMPORTANT: Ensure one representative has only one row for a specific book
            $table->unique(['rep_id', 'livre_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depots');
    }
};
