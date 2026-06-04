<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('remb_imp', function (Blueprint $table) {
            $table->foreignUuid('season_id')->nullable()->after('id')->constrained('seasons')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('remb_imp', function (Blueprint $table) {
            $table->dropForeign(['season_id']);
            $table->dropColumn('season_id');
        });
    }
};
