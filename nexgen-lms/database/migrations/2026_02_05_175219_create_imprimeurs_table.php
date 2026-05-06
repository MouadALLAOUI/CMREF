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
        Schema::create('imprimeurs', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID for security
            $table->string('raison_sociale', 255); // Renamed from 'ste' for professionalism
            $table->text('adresse')->nullable();
            $table->string('directeur_nom', 255)->nullable(); // Renamed from 'dir'
            $table->string('directeur_tel', 20)->nullable(); // Renamed from 'd_tel'
            $table->string('directeur_email', 255)->nullable(); // Renamed from 'd_email'
            $table->string('adjoint_nom', 255)->nullable(); // Renamed from 'adjoint'
            $table->string('adjoint_tel', 20)->nullable(); // Renamed from 'j_tel'
            $table->string('adjoint_email', 255)->nullable(); // Renamed from 'j_email'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imprimeurs');
    }
};
