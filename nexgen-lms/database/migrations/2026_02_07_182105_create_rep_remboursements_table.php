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
        Schema::create('rep_remboursements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');
            $table->foreignUuid('fact_id')->nullable()->constrained('fact')->onDelete('set null');
            $table->date('date_payment');
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->onDelete('set null');
            $table->string('cheque_number', 50)->nullable();
            $table->string('cheque_image_path')->nullable(); // New column for the image path
            $table->string('type_versement')->default('Versement');
            $table->string('compte')->nullable();
            $table->decimal('montant', 15, 2);
            $table->date('date_prevue')->nullable();
            $table->date('date_versement')->nullable();
            $table->boolean('statut_recu')->default(false);
            $table->boolean('statut_rejete')->default(false);
            $table->boolean('statut_accepte')->default(false);
            $table->string('annee', 4)->default(generateSchoolYear());
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rep_remboursements');
    }
};