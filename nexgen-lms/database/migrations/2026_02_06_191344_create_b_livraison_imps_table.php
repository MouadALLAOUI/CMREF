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
        Schema::create('b_livraison_imps', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('imprimeur_id')->constrained('imprimeurs')->onDelete('cascade'); // Link to Supplier
            // $table->uuidMorphs('deliverable');
            $table->date('date_reception'); // Professional DATE type
            $table->string('b_livraison_number', 50); // The supplier's BL number
            $table->text('remarks')->nullable(); // Legacy 'ann' field
            $table->string('annee', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_livraison_imps');
    }
};
