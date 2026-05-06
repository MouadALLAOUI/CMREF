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
        Schema::create('fact_sequences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nom', 9)->unique(); // ex: "2025-2026"
            $table->integer('dernier_numero')->default(0);
            $table->boolean('est_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fact_sequences');
    }
};
