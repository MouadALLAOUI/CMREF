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
        Schema::create('demande_f', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');
            $table->foreignUuid('client_id')->constrained('clients')->onDelete('cascade');
            $table->date('date_demande');
            $table->integer('ref');
            $table->string('type', 255);
            $table->integer('statut');
            $table->integer('livree')->default(0);
            $table->string('annee_scolaire', 4)->default(generateSchoolYear())->nullable();
            $table->text('contenu')->nullable(); // Détails de la demande
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_f');
    }
};
