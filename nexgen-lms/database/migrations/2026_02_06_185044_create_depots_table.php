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
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->uuid('rep_id')->nullable()->index(); // Link to Rep
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->uuid('livre_id')->nullable()->index(); // Link to Book
            $table->foreign('livre_id')->references('id')->on('livres')->nullOnDelete();
            $table->text('type')->nullable(); // Legacy 'ann' field
            $table->integer('quantite_balance')->default(0); // Tracks current stock held
            $table->integer('status')->default(1); // Status of the account line

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
