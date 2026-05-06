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
        Schema::create('fact', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');
            $table->foreignUuid('sequence_id')->constrained('fact_sequences')->onDelete('restrict');
            $table->foreignUuid('demande_id')->nullable()->constrained('demande_f')->onDelete('set null');
            $table->string('year_session', 9)->default('2026-2027'); // e.g., "2025-2026"
            $table->integer('number'); // The raw increment (1, 2, 3...)
            $table->string('fact_number', 50)->nullable()->unique(); // The full string: "FACT/26-27/0001"
            $table->date('date_facture');
            $table->decimal('total_ht', 15, 2)->default(0.00); // Total Hors Taxe
            $table->decimal('tva_rate', 5, 2)->default(20.00); // Standard Moroccan TVA
            $table->decimal('total_ttc', 15, 2)->default(0.00);
            $table->decimal('reste_a_payer', 15, 2)->default(0.00);
            $table->enum('status', ['Brouillon', 'Validée', 'Payée', 'Annulée'])->default('Brouillon');
            $table->text('remarques')->nullable();
            $table->timestamps();

            $table->unique(['year_session', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fact');
    }
};
