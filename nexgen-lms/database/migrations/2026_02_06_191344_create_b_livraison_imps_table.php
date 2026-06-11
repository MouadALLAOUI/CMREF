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
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->foreignUuid('imprimeur_id')->constrained('imprimeurs')->onDelete('cascade'); // Link to Supplier
            // $table->uuidMorphs('deliverable');
            $table->date('date_reception'); // Professional DATE type
            $table->string('b_livraison_number', 50)->unique(); // The supplier's BL number
            $table->text('remarks')->nullable(); // Legacy 'ann' field
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
