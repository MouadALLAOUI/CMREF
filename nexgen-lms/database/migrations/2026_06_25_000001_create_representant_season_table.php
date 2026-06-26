<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('representant_season', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('representant_id')->constrained('representants')->cascadeOnDelete();
            $table->foreignUuid('season_id')->constrained('seasons')->cascadeOnDelete();
            $table->enum('status', ['unlock', 'lock', 'disabled'])->default('unlock');
            $table->timestamps();
            $table->unique(['representant_id', 'season_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('representant_season');
    }
};
