<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fact', function (Blueprint $table) {
            $table->string('year_session', 9)->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('fact', function (Blueprint $table) {
            $table->string('year_session', 9)->default('2026-2027')->change();
        });
    }
};
